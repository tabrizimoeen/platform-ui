export function getErrorMessage(error) {

    if (!error.response) {
        return "ارتباط با سرور برقرار نشد";
    }

    const data = error.response.data;

    if (data?.message) {
        return data.message;
    }

    switch (error.response.status) {

        case 400:
            return "اطلاعات وارد شده معتبر نیست";

        case 401:
            return "لطفا دوباره وارد شوید";

        case 403:
            return "دسترسی ندارید";

        case 404:
            return "اطلاعات پیدا نشد";

        case 500:
            return "خطای داخلی سیستم";

        default:
            return "خطای ناشناخته";
    }
}