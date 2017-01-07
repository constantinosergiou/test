import Joi from 'joi'
import {values, find, size} from 'lodash'
import {intercomCustomAttributeKeys, intercomEvents, accountTypes} from '../../../common/enums'
import {createLoaders} from '../../../schema/loaders'
import knex from '../../../knex'
import schemas from './../schemas'
import IntercomTriggerBase from './base'


const createIntercomBonusObj = (bonus, customAttributes) => {
  return {
    event_name: `${bonus.account.productName}_bonus`,
    user_id: `bdswiss_${bonus.account.client.id}`,
    created_at: Math.ceil(new Date(bonus.createdAt).getTime() / 1000),
    metadata: {
      amount: {
        amount: bonus.amount * 100,
        currency: bonus.currency,
      },
      transaction_id: bonus.id,
      payment_method: bonus.payment.vendor,
    },
    custom_attributes: customAttributes,
  }
}
const bonusCustomAttributes = (bonuses, type) => {
  let attr = []
  let bonusDepositAmountTotal = `${intercomCustomAttributeKeys.bonusDepositAmountTotal.value}_${type.value}`
  let bonusDepositAmountTotalAll = `${intercomCustomAttributeKeys.bonusDepositAmountTotal.value}_all`
  let bonusDepositCount = `${intercomCustomAttributeKeys.bonusDepositCount.value}_${type.value}`
  let bonusDepositCountAll = `${intercomCustomAttributeKeys.bonusDepositCount.value}_all`
  attr[bonusDepositAmountTotal] = size(find(bonuses, (o) => o.account_id === type.productId))
  attr[bonusDepositAmountTotalAll] = size(bonuses)
  attr[bonusDepositCount] = size(find(bonuses, (o) => o.account_id === type.productId))
  attr[bonusDepositCountAll] = size(bonuses)
  return attr
}

export default class Bonus extends IntercomTriggerBase {
  constructor(intercomConfig) {
    super(intercomConfig, intercomEvents.events)
  }
  async bonusMade(bonus) {
    let validated = Joi.validate(bonus, schemas.bonusMade)
    if (validated.error) {
      throw new Error(validated.error)
    }
    const loaders = createLoaders(knex)
    let bonuses = await loaders.deposit.loadAll({vendor: 'bonus', memeber_id: bonus.clientId})
    let attributes = []
    let intercomAttr = intercomCustomAttributeKeys
    let lastBonusDepositAmount = `${intercomAttr.lastBonusDepositAmount.value}_${bonus.payment.vendor}`
    let lastBonusDepositDate = `${intercomAttr.lastBonusDepositDate.value}_${bonus.payment.vendor}`
    attributes[lastBonusDepositAmount] = bonus.amount
    attributes[lastBonusDepositDate] = bonus.createdAt
    for (let type of values(accountTypes)) {
      attributes.concat(bonusCustomAttributes(bonuses, type))
    }
    let data = createIntercomBonusObj(validated.value, attributes)
    this.sendToIntercom(data)
  }
}
