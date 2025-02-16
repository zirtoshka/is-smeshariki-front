import {Roles} from '../auth-tools/smesharik';

export enum GeneralStatus {
  NEW = "новый",
  IN_PROGRESS = "в процессе",
  DONE = "сделанно",
  CANCELED = "отменен"
}


export enum FriendStatus {
  NEW = "новый",
  FRIENDS = "друзья"
}

export enum ViolationType {
  SPAM = "SPAM",
  EROTIC_CONTENT = "извните, а где трусы (эротика)",
  VIOLENCE = "жестокость",
  HONEY = "мЁд",
  FRAUD_OR_MISLEADING = "мошенничество или введение в заблуждение"
}

// export function getEnumKeyByValue(enumObj: any, value: string): string | undefined {
//   return Object.keys(enumObj).find(key => enumObj[key] === value);
// }
//
// export function enumListToString(statuses: GeneralStatus[] | Roles[]): string | null {
//   if (statuses.length === 0) {
//     return null;
//   }
//   return statuses.map(status => getEnumKeyByValue(GeneralStatus, status)).join(',');
// }


export function getEnumKeyByValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: T[keyof T]
): string | undefined {
  return Object.keys(enumObj).find(key => enumObj[key] === value);
}
export function enumListToString<T extends Record<string, string | number>>(
  enumObj: T,
  statuses: T[keyof T][]
): string | null {
  if (statuses.length === 0) {
    return null;
  }
  return statuses.map(status => getEnumKeyByValue(enumObj, status)).join(',');
}

// enumListToString(GeneralStatus, statuses)
