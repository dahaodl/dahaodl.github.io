var CurrentPage = function () {

    var handleForgetPassword = function () {

        var $form = $('.forget-form');
        var loginAtempCount = $('#SendPasswordResetLinkAttemptCount').val();
        $form.validate();

        $form.submit(function (e) {
            e.preventDefault();

            if (!$form.valid()) {
                return;
            }

            var usernameTemp = $('#userNameResetPassword').val();

            var validUser = usernameTemp.toLowerCase();
            if (validUser.includes("_")) {
                var resPos = usernameTemp.lastIndexOf('_');
                if (resPos != -1) {
                    var res = usernameTemp.substring(0, resPos);
                    $('#tenancyNameResetPassword').val(res);
                }
                else {
                    $('#tenancyNameResetPassword').val("a");
                }
            }
            else {
                abp.notify.error("Tên tài khoản không hợp lệ");
                return;
            }

            abp.ui.setBusy(
                null,
                abp.ajax({
                    contentType: app.consts.contentTypes.formUrlencoded,
                    url: $form.attr('action'),
                    data: $form.serialize()
                }).done(function () {
                    abp.message.success(app.localize('PasswordResetMailSentMessage'), app.localize('MailSent'))
                    location.href = abp.appPath + 'Account/Login';
                }).fail(function (data) {
                    loginAtempCount = Number(loginAtempCount) + 1;

                    if (loginAtempCount >= 3) {
                        grecaptcha.reset();
                        $('#captcha_SendPasswordResetLink').removeClass("hidden");
                    }
                })
            );
        });

        window.onload = function () {
            console.log( "usernameTemp");

            loginAtempCount = $('#SendPasswordResetLinkAttemptCount').val();
            if (loginAtempCount >= 3) {

                $('#captcha_SendPasswordResetLink').removeClass("hidden");
            }
        }
    }

    return {
        init: function () {
            handleForgetPassword();
        }
    };
}();