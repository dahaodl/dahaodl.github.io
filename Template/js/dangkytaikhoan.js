var timer;
var end;
var soLanThucHien = 0;
var getOtpCount = 0;
var daNhanOTP = false;


function openModalDangKy(magoi) {
    $('#formDangKyNhaThuoc').modal('show');
    var $form = $("#frmDangKyTaiKhoan");
    var $validator = $form.validate();
    var $errors = $form.find(".field-validation-error span");
    $('#MaGoiCuocDangKy').val(magoi);
    $('#MaXacThuc').prop('disabled', true);
    getOtpCount = 0;
    daNhanOTP = false;
    $errors.each(function () { $validator.settings.success($(this)); })
    $validator.resetForm();
}

function copyThongTin() {
    $("#NguoiChiuTrachNhiemChuyenMon").val($("#NguoiDaiDien_Ten").val());
    $("#NguoiChiuTrachNhiemChuyenMon_CMTND").val($("#NguoiDaiDien_CMND").val());
    $("#NguoiChiuTrachNhiemChuyenMon_SoDienThoai").val($("#NguoiDaiDien_SoDienThoai").val());
    $("#NguoiChiuTrachNhiemChuyenMon_Email").val($("#NguoiDaiDien_Email").val());
}


function OnFailureDangKy() {
    $('#noti_dangkynhathuoc').removeClass('bg-green');
    $('#noti_dangkynhathuoc').addClass('bg-yellow');
    document.getElementById('noidungthongbao_dangkynhathuoc').innerText = "Lỗi!";
    $('#thongBaoThanhCong').modal('show');
    abp.ui.clearBusy("#formDangKyNhaThuoc");
}

function oncloseModalDangKyTaiKhoan() {
    end = new Date();
    $('#nhanMaXacThucBtn').html('Nhận mã xác thực qua SMS');
    $('#MaXacThuc').prop('disabled', true);
    getOtpCount = 0;
    daNhanOTP = false;
}

function OnSuccessDangKy(data, status, xhr) {
    if (data.result.success) {
        window.location.href = window.location.origin + "/Account/RegisterSuccess";
        //$('#noti').removeClass('bg-yellow');
        //$('#noti').addClass('bg-green');
        //$('#frmDangKyTaiKhoan')[0].reset();
        //$('#formDangKyNhaThuoc').modal('hide');
        //$('#thongBaoThanhCong').modal('show');
        //document.getElementById('noidungthongbao').innerHTML = "Đăng ký tài khoản thành công vui lòng kiểm tra email để xác thực tài khoản.";

    } else {
        if (data.result.isValidOtp) {
            $('#noti_dangkynhathuoc').removeClass('bg-green');
            $('#noti_dangkynhathuoc').addClass('bg-yellow');
            document.getElementById('noidungthongbao_dangkynhathuoc').innerText = data.result.errorMessage;
            $('#thongBaoThanhCong').modal('show');
        } else {
            
            var maXacThuc = $("#MaXacThuc").val();
            if (maXacThuc && maXacThuc.trim()) {
                if (data.result.otpErrorCode == '401') {
                    $('#thongBaoLbl').html('Số điện thoại không hợp lệ. Quý khách vui lòng kiểm tra lại.');
                } else {
                    if (soLanThucHien < 5) {
                        if (data.result.otpErrorCode == '404') {
                            $('#thongBaoLbl').html('Mã OTP không chính xác. Quý khách vui lòng nhập lại.');
                        }
                        if (data.result.otpErrorCode == '410') {
                            $('#thongBaoLbl').html('Mã OTP đã hết hạn. Quý khách vui lòng thực hiện gửi lại mã OTP.');
                        }
                    } else {
                        if (data.result.otpErrorCode == '404') {
                            $('#thongBaoLbl').html('Mã OTP không chính xác. Quý khách sẽ được chuyển về màn hình trang chủ.');
                        }
                        if (data.result.otpErrorCode == '410') {
                            $('#thongBaoLbl').html('Mã OTP đã hết hạn. Quý khách vui lòng thử lại sau.');
                        }
                        window.location.href = window.location.origin;
                    }
                    soLanThucHien++;
                }
            } else {
                if (daNhanOTP) {
                    $('#thongBaoLbl').html('Vui lòng nhập mã xác thực ');
                } else {
                    $('#thongBaoLbl').html(`Vui lòng nhập <strong>Mã xác thực</strong> bằng cách bấm <strong>Nhận mã xác thực qua SMS</strong>`);
                }
            }
        }
        abp.ui.clearBusy("#formDangKyNhaThuoc");
    }
}


function blockFromDangKyNhaThuoc() {
    abp.ui.setBusy("#formDangKyNhaThuoc");
}

function guiMaXacThuc() {
    var soDienThoai = $("#NguoiDaiDien_SoDienThoai").val();
    console.log('guiMaXacThuc: ', soDienThoai);
    var pattern = "^(\\+84[3|5|7|8|9]|84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\\b";
    var isValid = (new RegExp(pattern)).test(soDienThoai);
    if (!isValid) {
        $('#thongBaoLbl').html('Số điện thoại không hợp lệ. Vui lòng nhập lại số điện thoại');
    } else {
        if (getOtpCount >= 5) {
            abp.message.error("Đã quá số lần lấy lại mã OTP, quý khách vui lòng thử lại sau", " ");
            $("#formDangKyNhaThuoc").modal('toggle');
            return;
        }

        $.ajax({
            url:  window.location.origin + '/account/LayMaXacThucDangKyTaiKhoan',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                soDienThoai: soDienThoai,
            }),
            success: function (res) {
                console.log('guiMaXacThuc result: ', res);
                if (res.result.success) {
                    if (daNhanOTP) {
                        getOtpCount++;
                    }
                    daNhanOTP = true;
                    var soDienThoaiHienThi = convertSoDienThoai(soDienThoai);
                    $('#thongBaoLbl').html('Vui lòng nhập mã xác thực được gửi về số điện thoại ' + soDienThoaiHienThi + ' để hoàn tất quá trình đăng ký');
                    end = new Date();
                    end = new Date(end.getTime() + 179000);
                    $('#nhanMaXacThucBtn').html('Gửi lại mã xác thực');
                    $('#nhanMaXacThucBtn').prop('disabled', true);
                    $('#MaXacThuc').prop('disabled', false);
                    timer = setInterval(hienThiDongHoDemNguoc, 500);
                } else {
                    $('#thongBaoLbl').html(res.result.errorMessage);
                }
            },
            error: function (e) {
                //abp.notify.success("error");
            }
        });
    }
}

function convertSoDienThoai(soDienThoai) {
    var result = soDienThoai;
    var patternLeadingZero = "^(0[3|5|7|8|9])+([0-9]{8})\\b";
    var patternWithoutPlus = "^(84[3|5|7|8|9])+([0-9]{8})\\b";
    var isLeadingZero = (new RegExp(patternLeadingZero)).test(soDienThoai);
    var isWithoutPlus = (new RegExp(patternWithoutPlus)).test(soDienThoai);
    if (isLeadingZero) {
        result = "+84" + soDienThoai.slice(1);
    }
    else if (isWithoutPlus) {
        result = "+" + soDienThoai;
    }
    result = result.substring(0, 3) + " " + result.substring(3, 6) + " " + result.substring(6, 9) + " " + result.substring(9, 12);
    return result;
}

function ValidateNumber(e) {
    var evt = (e) ? e : window.event;
    var charCode = (evt.keyCode) ? evt.keyCode : evt.which;
    if (charCode == 107
        || charCode == 8
        || charCode == 9
        || charCode == 37
        || charCode == 39
        || charCode == 123
        || charCode == 116
        || (charCode == 187 && e.shiftKey)
        || (charCode == 67 && e.ctrlKey)
        || (charCode == 65 && e.ctrlKey)
        || (charCode == 86 && e.ctrlKey)
        || (charCode == 88 && e.ctrlKey)
        || (charCode == 90 && e.ctrlKey)
        || (charCode > 47 && charCode < 58 && !e.shiftKey)
        || (charCode > 95 && charCode < 106)) {
        return true;
    } else {
        return false;
    }

};

function hienThiDongHoDemNguoc() {
    var now = new Date();
    var dif = end.getTime() - now.getTime();
    var distance = Math.ceil(dif / 1000);
    if (distance < 0) {
        clearInterval(timer);
        $('#thongBaoLbl').html('Nếu quý khách không nhận được tin nhắn, vui lòng bấm Gửi lại mã xác thực');
        $('#nhanMaXacThucBtn').prop('disabled', false);
        return;
    }
    var minute = Math.floor(distance / 60);
    document.getElementById('countdown').innerHTML = (minute < 10 ? '0' : minute) + Math.floor(distance / 60) + ':' + ((distance % 60) < 10 ? '0' : '') + (distance % 60);
}

function onChangeTinh(ccbId, tinhId) {
    //loaddataforHuyen($(ccbId), tinhId);

    var skillsSelect = document.getElementById("TinhID");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#Tinh").val(selectedText);
}

function onChangeHuyen(ccbId, cbbTinh, huyenId) {
    var tinhId = $(cbbTinh).val();
    //loaddataforXa($(ccbId), tinhId, huyenId);

    var skillsSelect = document.getElementById("HuyenID");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#Huyen").val(selectedText);
}

function onChangeXa(value) {
    var skillsSelect = document.getElementById("XaID");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#Xa").val(selectedText);
}