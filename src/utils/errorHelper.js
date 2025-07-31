export function extractErrorMessages(error, defaultMsg = "Something went wrong") {
  if (
    error?.response?.data?.error &&
    typeof error.response.data.error === "object"
  ) {
    return Object.values(error.response.data.error)
      .flat()
      .join(", ");
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return defaultMsg;
}
