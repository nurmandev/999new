export function getErrorMessage(errorType: string) {
  let message = '';
  const err = errorType?.split('_');
  switch (err[0]) {
    // user & auth
    case 'isNotExistUser':
      message = 'authentication:userNotAllow';
      break;
    case 'isNotExistMail':
      message = 'errors:auth:notExistMail';
      break;
    case 'isNotExistPhone':
      message = 'errors:auth:notExistPhone';
      break;
    case 'isNotExistMailOrPhone':
      message = 'errors:auth:notExistMailOrPhone';
      break;
    case 'isNotMatchConfirmationPassword':
      message = 'errors:auth:notMatchConfirmationPassword';
      break;
    case 'disabledAccount':
      message = 'errors:auth:disabledAccount';
      break;
    case 'isNotValidToken':
      message = 'errors:auth:notValidToken';
      break;
    case 'isNotAllowedUser':
      message = 'authentication:userNotAllow';
      break;
    case 'isExpiredToken':
      message = 'errors:auth:expiredToken';
      break;
    case 'isRequiredMail':
      message = 'errors:auth:requiredMail';
      break;
    case 'isExistMail':
      message = 'errors:auth:existMail';
      break;
    case 'isExistPhone':
      message = 'errors:auth:existPhone';
      break;
    case 'isValidReferral':
      message = 'errors:auth:validReferral';
      break;
    case 'isNotPhoneVerified':
      message = 'errors:auth:verifyPhone';
      break;
    case 'isNotMailVerified':
      message = 'errors:auth:verifyMail';
      break;
    case 'isNotMatchededCredential':
      message = 'errors:auth:notMatchedCredential';
      break;
    case 'isNotMatchedPassword':
      message = 'errors:auth:notMatchedPassword';
      break;
    case 'isNotMatchedEmail':
      message = 'errors:auth:notMatchedEmail';
      break;
    case 'isNotExistPassword':
      message = 'errors:auth:notExistPassword';
      break;
    case 'isNotMatched2FA':
      message = 'errors:auth:notMatched2FA';
      break;
    case 'isNotMatchedCurrentPassword':
      message = 'errors:auth:notMatchedCurrentPassword';
      break;
    case 'sendGridError':
      message = 'errors:auth:sendGridError';
      break;
    case 'twiloError':
      message = 'errors:auth:twiloError';
      break;
    case 'isNotMatchedVerificationCode':
      message = 'errors:auth:notMatchedVerificationCode';
      break;
    case 'isExpiredVerificationCode':
      message = 'errors:auth:expiredVerficationCode';
      break;
    case 'isNotValidTgInfo':
      message = 'errors:auth:notValidTgInfo';
      break;
    case 'isNotValidSelfExlusionTime':
      message = 'errors:auth:notValidSelfExlusionTime';
      break;
    case 'internalServerError':
      message = 'errors:internalServer';
      break;
    case 'badRequest':
      message = 'errors:badRequest';
      break;
    case 'isNotAllowedAction':
      message = 'errors:notAllowedAction';
      break;
    case 'isNotMatchOTPError':
      message = 'errors:auth:notMatchOTP';
      break;
    case 'isMatchReferralCodeError':
      message = 'errors:auth:validReferral';
      break;

    // affiliate
    case 'isEmptyAvailableCommissionRewards':
      message = 'errors:affiliate:emptyAvailableCommissionRewards';
      break;
    case 'isEmptyAvailableReferralRewards':
      message = 'errors:affiliate:emptyAvailableReferralRewards';
      break;
    case 'isNotEnoughBonusPool':
      message = 'errors:bonus:notEnoughBonusPool';
      break;
    case 'isExistLevelUpBonus':
      message = 'errros:bonus:existLevelUpBonus';
      break;
    case 'isClaimBonus':
      message = 'errors:bonus:claimBonus';
      break;
    case 'isExistBonusType':
      message = 'errors:bonus:existBonusType';
      break;
    case 'isFinishedQuestToClaim':
      message = 'errors:bonus:finishedQuestToClaim';
      break;
    case 'isEmptyAvailableSpin':
      message = 'errors:bonus:emptyAvailableSpin';
      break;
    case 'isVIP22ForSuperSpin':
      message = 'errors:bonus:VIP22ForSuperSpin';
      break;
    case 'isVIP70ForMegaSpin':
      message = 'errors:bonus:VIP70ForMegaSpin';
      break;

    // game
    case 'isExistGame':
      message = 'errors:game:existGame';
      break;
    case 'canDetectLocation':
      message = 'errors:game:canDetectLocation';
      break;
    case 'canDetectLocation':
      message = 'errors:game:canDetectLocation';
      break;
    case 'isExistCurrency':
      message = 'errors:game:existCurrency';
      break;
    case 'isExistCurrencyType':
      message = 'errors:game:existCurrencyType';
      break;
    case 'isMatchedWithSign':
      message = 'errors:game:matchedWithSign';
      break;
    case 'isExistGameRating':
      message = 'errors:game:existGameRating';
      break;
    case 'isExistGameReport':
      message = 'errors:game:existGameReport';
      break;

    // page
    case 'exceedTotalPageNumber':
      message = 'errors:page:exceedTotalPageNumber';
      break;

    // swap
    case 'isExistSourceCrypto':
      message = 'errors:swap:existSourceCrypto';
      break;
    case 'isExistDestinationCrypto':
      message = 'errors:swap:existDestinationCrypto';
      break;
    case 'isEnoughBalanceForSwap':
      message = 'errors:swap:enoughBalanceForSwap';
      break;
    case 'disableSwap':
      message = 'errors:swap:disabledToken';
      break;

    // withdraw
    case 'notCompleteRollOverToWithdraw':
      message = 'errors:tip:notCompleteRollOverToWithdraw';
      break;
    case 'restrictWithdraw':
      message = 'errors:withdraw:restrictWithdraw';
      break;
    case 'exceedAvailableWithdrawalAmount':
      message = 'errors:withdraw:exceedAvailableWithdrawalAmount';
      break;
    case 'exceedAvailableBalanceToWithdraw':
      message = 'errors:withdraw:exceedAvailableBalanceToWithdraw';
      break;
    case 'exceedAmountForTip':
      message = 'errors:withdraw:exceedAmountForTip';
      break;
    case 'notZeroAmountForTip':
      message = 'errors:withdraw:notZeroAmountForTip';
      break;
    case 'canClaimOnRakeback':
      message = 'errors:wallet:canClaimOnRakeback';
      break;
    case 'canClaimWithMinimumAmount':
      message = 'errors:wallet:canClaimWithMinimumAmount';
      break;
    case 'isExistAirdropCode':
      message = 'bonus:redeemNoCode';
      break;
    case 'disabledWithdraw':
      message = 'withdraw:withdrawDisable';
      break;

    // chat
    case 'isExceedMessageCount':
      message = 'errors:chat:isExceedMessageCount';
      break;
    case 'notMinimumVipLevelForTip':
      message = 'errors:notMinimumVipLevelForTip';
      break;
    case 'notReachedMinAmountForTip':
      message = 'errors:tip:notReachedMinAmountForTip';
      break;
    //bonus
    case 'exceedAirdropTimes':
      message = 'errors:bonus:exceedAirdropTimes';
      break;
    case 'redeemedAirdropBonus':
      message = 'errors:bonus:redeemedAirdropBonus';
      break;
    default:
      message = 'errors:internalServer';
      break;
  }
  if (err[0].indexOf('enoughBalanceForSwap') >= 0) message = 'errors:swap:enoughBalanceForSwap';
  return message;
}
