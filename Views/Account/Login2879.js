var CurrentPage = function () {
    var loginAtempCount = 0;
    var handleLogin = function () {
        var $loginForm = $('.login-form');

        var urlLogin = $loginForm.attr('action');

        $loginForm.validate({
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            }
        });

        var onClickGoToBanHang = function () {
            //urlLogin = '/?returnUrl=/Application/Index#!/banhang';
            $loginForm.find('input[name=returnUrlHash]').val('#!/banhang');
        }
        var btnGoToBanHang = document.getElementById('btnGoToBanHang');
        btnGoToBanHang.addEventListener("click", onClickGoToBanHang);
          
        $loginForm.submit(function (e) {
            e.preventDefault();

            var usernameTemp = $('#usernameOrEmailAddressID').val();
            var validUser = usernameTemp.toLowerCase();
            if (validUser.includes("_")) {
                var resPos = usernameTemp.lastIndexOf('_');
                if (resPos != -1) {
                    var res = usernameTemp.substring(0, resPos);
                    if (res == "admin") {
                        $('#tenancyNameID').val("");
                    }
                    else {
                        $('#tenancyNameID').val(res);
                    }
                }
                else {
                    $('#tenancyNameID').val("");
                }
            }
            else {
                $('#tenancyNameID').val("");
            }

            if (!$('.login-form').valid()) {
                return;
            }

            var passwordValue = $('#password-field').val();
            if (!app.isNullOrEmpty(passwordValue)) {
                passwordValue = passwordValue.trim();
            }
           

         
            //Mã hóa mật khẩu trước khi post lên server

            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(`MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHVD2kA1aFkJUiPQ94lv1+ew1PRYSn9bjjEppwi4MdLmM6D6PJNMNem1ObKpfesOFlv5C9jQ3FuToxpDeq+wHYCeue02yOX6tRmA2oBwIZehc2eOVaZFEpZJ/4EjVDnxQ8QYgXqH4YJOWgSOAbGND3LkeHJO1h+8PSq0J50HpAnLAgMBAAE=`);
            var encrypted = encrypt.encrypt(passwordValue);
            var dataSerialized = "";
            //End Mã hóa mật khẩu trước khi post lên server

            var myArray = $loginForm.serialize().split("&");
             
            for (var i = 0; i < myArray.length; i++) {
                let word = myArray[i]; 
                if (word.startsWith("password=")) {
                    dataSerialized += "password=" + encodeURIComponent(encrypted) + "&";
                } else {
                    if (i == myArray.length - 1) {
                        dataSerialized += word;
                    } else {
                        dataSerialized += word + "&";
                    }
                }

            }
            //console.log(dataSerialized, " dataSerialized");
            //console.log($loginForm.serialize(), " $loginForm.serialize()");

            //debugger;
            abp.ui.setBusy(
                null,
                abp.ajax({
                    contentType: app.consts.contentTypes.formUrlencoded,
                    url: urlLogin,
                    data: dataSerialized + '&loginAttemptCount=' + loginAtempCount
                }).fail(function (data) {
                    if ($("#DevEnvironment").val() == "1") {
                        loginAtempCount = Number(loginAtempCount) + 1;
                        if (loginAtempCount >= 3) {
                            grecaptcha.reset();
                            $('#captchaLogin').removeClass("hidden");
                        }
                    }
                    
                })
            );
        });

        $('a.social-login-icon').click(function () {
            var $a = $(this);
            var $form = $a.closest('form');
            $form.find('input[name=provider]').val($a.attr('data-provider'));
            $form.submit();
        });

        $loginForm.find('input[name=returnUrlHash]').val(location.hash);

        $('input[type=text]').first().focus();

        $(".toggle-password").click(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });

        window.onload = function () {
            loginAtempCount = $('#LoginAttemptCount').val();
            if (loginAtempCount >= 3) {

                $('#captchaLogin').removeClass("hidden");
            }
        }
    }

    return {
        init: function () {
            handleLogin();
        }
    };

}();