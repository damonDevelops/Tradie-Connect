//Simple function that checks the postcode value passed and returns a state
export default function postCodeToState(event) {
  if (
    (event >= 1000 && event <= 1999) ||
    (event >= 2000 && event <= 2599) ||
    (event >= 2619 && event <= 2899) ||
    (event >= 2921 && event <= 2999)
  ) {
    return "New South Wales";
  } else if (
    (event >= 200 && event <= 299) ||
    (event >= 2600 && event <= 2618) ||
    (event >= 2900 && event <= 2920)
  ) {
    return "Australian Captial Territory";
  } else if (
    (event >= 3000 && event <= 3999) ||
    (event >= 8000 && event <= 8999)
  ) {
    return "Victoria";
  } else if (
    (event >= 4000 && event <= 4999) ||
    (event >= 9000 && event <= 9999)
  ) {
    return "Queensland";
  } else if (
    (event >= 5000 && event <= 5799) ||
    (event >= 5800 && event <= 5999)
  ) {
    return "South Australia";
  } else if (
    (event >= 6000 && event <= 6797) ||
    (event >= 6800 && event <= 6999)
  ) {
    return "Western Australia";
  } else if (
    (event >= 7000 && event <= 7799) ||
    (event >= 7800 && event <= 7999)
  ) {
    return "Tasmania";
  } else if ((event >= 800 && event <= 899) || (event >= 900 && event <= 999)) {
    return "Northern Territory";
  }
}
