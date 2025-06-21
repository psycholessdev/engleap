type UnknownObject = Record<string, unknown> | unknown[] | unknown

export const deepCompare = (obj1: UnknownObject, obj2: UnknownObject) => {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || (!deepCompare(obj1[key] as unknown, obj2[key]) as unknown)) {
      return false
    }
  }

  return true
}
