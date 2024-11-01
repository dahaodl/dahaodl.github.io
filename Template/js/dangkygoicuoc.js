

var dichVuDangKy = {
    ma_nha_thuoc: "",
    ma_nha_thuoc_thanh_toan: "",
    ma_dich_vu: "",
    gia_dich_vu: 0,
    mo_ta: "",
    so_tai_khoan: 0,
    tong_tien_thanh_toan: 0,
    tong_tien: 0,
    so_luong: 1,
    ten_dich_vu: "",
    thoi_gian_su_dung: 0,
    ngay_het_han: "",
    tong_tien_con_lai_goi_cu: 0,
    loai_dich_vu: 1,
    loai_thoi_gian_su_dung: 2,
    da_dang_ky: "0",
    loai_tai_khoan_thanh_toan: 1,
    so_du_nha_thuoc_thanh_toan: "",
    loai_viettelpay_thanh_toan: 2
};

var soLanGetOtp = 0;
var daNhanOtp = false;

var soDienThoaiNhanOtp = "";

var isValidMaXacThuc = false;

var loginAtempCount = 0;

function isNullOrEmpty(val) {
    var f = false;
    if (typeof (val) == 'undefined') {
        f = true;
        return f;
    }
    if (val == null || val.length === 0) {
        f = true;
        return f;
    }
    val = String(val).replace(/ /g, '');
    if (val == '') {
        f = true;
        return f;
    }
    return f;

};

function getPhoneNumberFromText(phoneNumber) {
    if (!isNullOrEmpty(phoneNumber)) {
        phoneNumber = phoneNumber.trim();
        if (phoneNumber.includes("+84")) {
            phoneNumber = phoneNumber.replace("+84", "0");
        }
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        phoneNumber = phoneNumber.substr(0, 10);
    }
    return phoneNumber;
}

function onchangeMaXacThuc() {
    isValidMaXacThuc = !isNullOrEmpty($("#MaXacThucDangKyGoiCuoc").val());
    $("#btn-dangkygoicuoc").attr("disabled", !isValidMaXacThuc);
}

function getTextSoDienThoaiNhanOtp(sdt) {
    if (sdt) {
        return "+84 xxx xxx " + sdt.substring(sdt.length - 3);
    }
}

function openModalDangKyGoiCuoc(maGoiCuoc, giaGoiCuoc, soTaiKhoan, thoiGianSuDung, loaiThoiGianSuDung, nhaThuocId, maNhaThuoc, soDuTaiKhoan) {
    $.ajax({
        url: 'api/services/app/maXacThuc/CheckLockDangKyGoiCuoc',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
       
        success: function (res) {
            var result = res.result;
            if (result.code == 1) {
                if (result.returnValue > 5) {
                    abp.message.error("Tính năng Đăng ký gói cước đang bị khoá trong 5 phút.Quý khách vui lòng thử lại sau", " ");
                    return;
                }
                else {
                    $('#dangkygoicuoc').modal('show');
                }
            }
            else {
                
            }


        },
        error: function (e) {
            //abp.notify.success("error");
        }
    });


    $('#MaGoiCuoc').val(maGoiCuoc);
    //copyThongTinTaiKhoan();
    abp.ui.setBusy("#modalDangKyGoiCuocBody");
    soLanGetOtp = 0;
    daNhanOtp = false;

    let tenGoi = "";
    let giaGoi = "";
    if (maGoiCuoc == "GCTQ_6_2") {
        tenGoi = "Gói cước 6 tháng (2 tài khoản)";
        giaGoi = "480.000";
    } else if (maGoiCuoc == "GCTQ_6_3") {
        tenGoi = "Gói cước 6 tháng (3 tài khoản)";
        giaGoi = "600.000";
    } else if (maGoiCuoc == "GCTQ_6") {
        tenGoi = "Gói 6 tháng (Không giới hạn)";
        giaGoi = "900.000";
    } else if (maGoiCuoc == "GCTQ_12_2") {
        tenGoi = "Gói cước 12 tháng (2 tài khoản)";
        giaGoi = "960.000";
    } else if (maGoiCuoc == "GCTQ_12_3") {
        tenGoi = "Gói cước 12 tháng (3 tài khoản)";
        giaGoi = "1.200.000";
    } else if (maGoiCuoc == "GCTQ_12") {
        tenGoi = "Gói cước 12 tháng (Không giới hạn)";
        giaGoi = "1.800.000";
    } else if (maGoiCuoc == "GCTQ_18_2") {
        tenGoi = "Gói cước 18 tháng (2 tài khoản)";
        giaGoi = "1.440.000";
    } else if (maGoiCuoc == "GCTQ_18_3") {
        tenGoi = "Gói cước 18 tháng (3 tài khoản)";
        giaGoi = "1.800.000";
    } else if (maGoiCuoc == "GCTQ_24_2") {
        tenGoi = "Gói cước 24 tháng (2 tài khoản)";
        giaGoi = "1.920.000";
    }

    
    
    $.ajax({
        url: 'api/services/app/thietLapNhaThuoc/layThongTinNhaThuoc',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (res) {
            var result = res.result;
            if (result.code == 1) {
                soDienThoaiNhanOtp = getPhoneNumberFromText(result.returnValue.soDienThoaiChuNhaThuoc);
            }
        },
        error: function (e) {
            //abp.notify.success("error");
        }
    });

    

    if (!app.isNullOrEmpty(maNhaThuoc)) {
        dichVuDangKy.ma_nha_thuoc = maNhaThuoc;
        dichVuDangKy.ma_nha_thuoc_thanh_toan = maNhaThuoc;
        dichVuDangKy.so_du_nha_thuoc_thanh_toan = soDuTaiKhoan;

        $.ajax({
            url: 'api/services/app/lichSuGiaoDich/LayThongTinGoiDichVuDangKy',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                maDichVu: maGoiCuoc,
                thoiHanSuDung: thoiGianSuDung,
                loaiThoiHanSuDung: loaiThoiGianSuDung,
                maNhaThuoc: maNhaThuoc,
                nhaThuocId: nhaThuocId,
                soLuong: 1,
                loaiDichVu: 1,
            }),
            success: function (res) {
                var result = res.result;
                abp.ui.clearBusy("#modalDangKyGoiCuocBody");
                if (result.code == 1) {
                    dichVuDangKy.ma_dich_vu = maGoiCuoc;
                    dichVuDangKy.gia_dich_vu = giaGoiCuoc;
                    dichVuDangKy.mo_ta = "";
                    dichVuDangKy.so_tai_khoan = soTaiKhoan;
                    dichVuDangKy.ten_dich_vu = tenGoi;
                    dichVuDangKy.thoi_gian_su_dung = result.returnValue.thoi_gian_su_dung;
                    dichVuDangKy.tong_tien_con_lai_goi_cu = result.returnValue.tong_tien_con_lai_goi_cu;
                    dichVuDangKy.ngay_bat_dau = result.returnValue.ngay_bat_dau;
                    dichVuDangKy.ngay_het_han = result.returnValue.ngay_het_han;

                    document.getElementById("thoigiansudung").innerHTML = result.returnValue.ngay_bat_dau + " - " + result.returnValue.ngay_het_han;

                    if (dichVuDangKy.loai_dich_vu == 2) {
                        dichVuDangKy.so_luong = result.returnValue.so_luong;
                    }

                    tinhTien(dichVuDangKy);
                }
                

            },
            error: function (e) {
                //abp.notify.success("error");
            }
        });

    }

    //console.log(maGoiCuoc, giaGoiCuoc, soTaiKhoan, thoiGianSuDung, loaiThoiGianSuDung, nhaThuocId, maNhaThuoc, soDuTaiKhoan)

    document.getElementById("sodutaikhoan").innerHTML = soDuTaiKhoan.toLocaleString();
    document.getElementById("thoigiansudung").innerHTML = "-";
    document.getElementById("tieudegoi").innerHTML = tenGoi;
    document.getElementById("tonggiagoi").innerHTML = giaGoi;
    document.getElementById("tongtienthanhtoan").innerHTML = (giaGoiCuoc - soDuTaiKhoan >= 0 ? giaGoiCuoc - soDuTaiKhoan:0 ).toLocaleString();
}


function guiMaXacThucDangKyGoiCuoc() {
    if (isNullOrEmpty(soDienThoaiNhanOtp)) {
        $('#thongBaoLblDangKyGoiCuoc').html("Vui lòng truy cập vào Quản trị -> Cài đặt -> Thông tin nhà thuốc thiết lập số điện thoại nhà thuốc để nhận mã xác thực");
        return;
    }
   

    if (soLanGetOtp >= 5) {
        abp.message.error("Đã quá số lần lấy lại mã OTP, quý khách vui lòng thử lại sau", " ");
        $("#dangkygoicuoc").modal('toggle');
        return;
    }
    

    $.ajax({
        url: 'api/services/app/maXacThuc/taoMaXacThucDangKyGoiCuoc',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            soDienThoai: soDienThoaiNhanOtp,
        }),
        success: function (res) {
            var result = res.result;
            if (result.code == 1) {
                if (daNhanOtp) {
                    soLanGetOtp++;
                }
                $('#thongBaoLblDangKyGoiCuoc').html('Vui lòng nhập mã xác thực được gửi về số điện thoại ' + getTextSoDienThoaiNhanOtp(soDienThoaiNhanOtp) + ' để hoàn tất quá trình đăng ký');
                end = new Date();
                end = new Date(end.getTime() + 179000);
                daNhanOtp = true;
                $('#nhanMaXacThucBtnDangKyGoiCuoc').html('Gửi lại mã xác thực');
                $('#nhanMaXacThucBtnDangKyGoiCuoc').prop('disabled', true);
                $('#MaXacThucDangKyGoiCuoc').prop('disabled', false);
                timer = setInterval(hienThiDemNguoc, 500);
            }
            else {
                $('#thongBaoLblDangKyGoiCuoc').html(result.message);
            }
        },
        error: function (e) {
            $('#thongBaoLblDangKyGoiCuoc').html(e.result.message);
        }
    });

}
function hienThiDemNguoc() {
    var now = new Date();
    var dif = end.getTime() - now.getTime();
    var distance = Math.ceil(dif / 1000);
    if (distance < 0) {
        clearInterval(timer);
        $('#thongBaoLblDangKyGoiCuoc').html('Nếu quý khách không nhận được tin nhắn, vui lòng bấm Gửi lại mã xác thực');
        $('#nhanMaXacThucBtnDangKyGoiCuoc').prop('disabled', false);
        return;
    }
    var minute = Math.floor(distance / 60);
    document.getElementById('countdownDangKyGoiCuoc').innerHTML = (minute < 10 ? '0' : minute) + Math.floor(distance / 60) + ':' + ((distance % 60) < 10 ? '0' : '') + (distance % 60);
}

function onchangeCheckBoxDieuKhoan() {
    var dongYDieuKhoan = $("#checkbox_dongydieukhoan").prop('checked')
    $("#btn-tieptuc").attr("disabled", !dongYDieuKhoan);
}

function tiepTuc() {
    if ($("#checkbox_dongydieukhoan").prop('checked')) {
        $("#btn-dangkygoicuoc").removeClass("hidden");
        $("#tabThongTinKhachHang").removeClass("hidden");
        $("#ma_xac_thuc_area").removeClass("hidden");
        $("#btn-dangkygoicuoc").attr("disabled", false);


        $("#btn-trolai").removeClass("hidden");
        $("#btn-tieptuc").addClass("hidden");
        $("#dongydieukhoan").addClass("hidden");
        $("#tabDieuKhoanSuDung").addClass("hidden");
        $('#thongBaoLblDangKyGoiCuoc').html("Lưu ý: Mã OTP sẽ được gửi về số điện thoại " + getTextSoDienThoaiNhanOtp(soDienThoaiNhanOtp) + " . Nếu quý khách muốn thay đổi số điện thoại, vui lòng chỉnh sửa thông tin nhà thuốc tại <a title='Đi đến phân hệ cài đặt' style='color: black;' href='/Application/Index#!/tenant/settings' target='_blank'> phân hệ Cài đặt</a> và thực hiện lại");
    }

    
}
function troLai() {
    $("#btn-dangkygoicuoc").addClass("hidden");
    $("#tabThongTinKhachHang").addClass("hidden");
    $("#btn-trolai").addClass("hidden");
    $("#ma_xac_thuc_area").addClass("hidden");


    $("#btn-tieptuc").removeClass("hidden");
    $("#dongydieukhoan").removeClass("hidden");
    $("#tabDieuKhoanSuDung").removeClass("hidden");
}

function thanhToanGoiCuoc() {

    var maXacThuc = $("#MaXacThucDangKyGoiCuoc").val();

    maXacThuc = maXacThuc.trim();

    abp.ui.setBusy("#modalDangKyGoiCuocBody");


    $.ajax({
        url: 'api/services/app/maXacThuc/kiemTraMaXacThucDangKyGoiCuoc',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            SoDienThoai: soDienThoaiNhanOtp,
            Ma: maXacThuc
        }),
        success: function (res) {
            var result = res.result;
            if (result.code == 1) {
                var devEnvironment = $('#DevEnvironment').val();

                $.ajax({
                    url: 'api/services/app/lichSuGiaoDich/ThanhToanGoiCuoc',
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: JSON.stringify(dichVuDangKy),
                    success: function (resThanhToanGoiCuoc) {
                        var result = resThanhToanGoiCuoc.result;
                        if (result.code == 1) {
                            if (dichVuDangKy.tong_tien_thanh_toan == 0) {
                                abp.notify.success("Đăng ký gói cước thành công");
                            }
                            else {
                                var viettelPayInfo = result.returnValue;
                                if (dichVuDangKy.loai_viettelpay_thanh_toan == 2) {

                                    if (devEnvironment == "1") {
                                        napTienViettelPayDev(viettelPayInfo);
                                    }
                                    else
                                    {
                                        var urlReturn = window.location.origin + '/PaymentGateway/PaymentResult';
                                        var urlThanhToan = 'https://pay3.viettel.vn/PaymentGateway/payment?';
                                        if (devEnvironment == "1") {
                                            urlThanhToan = 'https://sandbox.viettel.vn/PaymentGateway/payment?';
                                        }

                                        urlThanhToan += 'billcode=' + viettelPayInfo.billcode;
                                        urlThanhToan += '&command=' + viettelPayInfo.command;
                                        urlThanhToan += '&desc=Thanh%20to%C3%A1n';
                                        urlThanhToan += '&locale=' + viettelPayInfo.locale;
                                        urlThanhToan += '&merchant_code=' + viettelPayInfo.merchant_code;
                                        urlThanhToan += '&order_id=' + viettelPayInfo.order_id;
                                        urlThanhToan += '&return_url=' + urlReturn;
                                        urlThanhToan += '&trans_amount=' + viettelPayInfo.trans_amount;
                                        urlThanhToan += '&version=2.0';
                                        urlThanhToan += '&check_sum=' + viettelPayInfo.check_sum;
                                        window.open(urlThanhToan, '_self');
                                    }
                                }
                                else {
                                    $('#thongBaoLblDangKyGoiCuoc').html(result.message);
                                }
                            }
                        }
                        else {
                            $('#thongBaoLblDangKyGoiCuoc').html(result.message);
                        }



                    },
                    error: function (e) {
                        //abp.notify.info(app.localize("HeThongDangTrongQuaTrinhXuLy"));
                    }
                });
            }
            else {
                if (result.returnAdditionValue > 5) {
                    abp.message.error("Tính năng Đăng ký gói cước đang bị khoá trong 5 phút.Quý khách vui lòng thử lại sau", " ");
                    $("#dangkygoicuoc").modal('toggle');
                    return;
                }
                abp.ui.clearBusy("#modalDangKyGoiCuocBody");
                $('#thongBaoLblDangKyGoiCuoc').html(result.message);

            }
        },
        error: function (e) {
            abp.ui.clearBusy("#modalDangKyGoiCuocBody");
            $('#thongBaoLblDangKyGoiCuoc').html(e.result.message);
        }
    });


    
}


function napTienViettelPayDev(viettelPayInfo) {
    var input = {
        billcode: viettelPayInfo.billcode,
        cust_msisdn: "0979162224",
        error_code: "00",
        merchant_code: viettelPayInfo.merchant_code,
        order_id: viettelPayInfo.order_id,
        payment_status: 1,
        trans_amount: viettelPayInfo.trans_amount,
        vt_transaction_id: viettelPayInfo.billcode,
        check_sum: viettelPayInfo.billcode,
    };

    $.ajax({
        url: 'api/services/app/lichSuGiaoDich/NapTienViettelPayDev',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(input),
        success: function (resNTTT_Dev) {
            var result = resNTTT_Dev.result;
            abp.ui.clearBusy("#modalDangKyGoiCuocBody");
            if (result.code == 1) {
                abp.notify.success("Đăng ký gói cước thành công");
                $('#dangkygoicuoc').modal('hide');
            }
            else {
                abp.message.error(result.message, " ");
            }

        },
        error: function (e) {
            //abp.notify.success("error");
        }
    });

};


function tinhTien(dv) {
    dv.tong_tien = dichVuDangKy.gia_dich_vu * dv.so_luong;
    dv.tong_tien_thanh_toan = dv.tong_tien - dv.so_du_nha_thuoc_thanh_toan;
    if (dv.tong_tien_thanh_toan < 0) {
        dv.tong_tien_thanh_toan = 0;
    }
};

function copyThongTinTaiKhoan() {
    //debugger
    onChangeTinhGetName("#HoaDonHuyenId", $("#TinhId").val());
    onChangeHuyenGetName("#HoaDonXaId", "#TinhId", $("#HuyenId").val());

    $("#TenDoanhNghiep").val($("#TenDoanhNghiep").val());
    $("#HoaDonTinhId").val($("#TinhId").val());
    $("#HoaDonHuyenId").val($("#HuyenId").val());
    $("#HoaDonXaId").val($("#XaId").val());
    $("#HoaDonTenTinh").val($("#TenTinh").val());
    $("#HoaDonTenHuyen").val($("#TenHuyen").val());
    $("#HoaDonTenXa").val($("#TenXa").val());
}



function onChangeTinhGetName(ccbId, tinhId) {
    //loaddataforHuyen($(ccbId), tinhId);

    var skillsSelect = document.getElementById("HoaDonTinhId");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#HoaDonTenTinh").val(selectedText);
}

function onChangeHuyenGetName(ccbId, cbbTinh, huyenId) {
    var tinhId = $(cbbTinh).val();
    //loaddataforXa($(ccbId), tinhId, huyenId);

    var skillsSelect = document.getElementById("HoaDonHuyenId");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#HoaDonTenHuyen").val(selectedText);
}

function onChangeXaGetName(value) {
    var skillsSelect = document.getElementById("HoaDonXaId");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    $("#HoaDonTenXa").val(selectedText);
}


function openModalLogin(magoi) {
    $('#loginmodal').modal('show');
    $('#MaGoiCuocLogin').val(magoi);
}

function dongModalLogin() {
    $('#loginmodal').modal('hide');
    $('#MaGoiCuocLogin').val("");
}

function openDangKyTuFrmLogin() {
    $('#loginmodal').modal('hide');
    openModalDangKy($('#MaGoiCuocLogin').val());
    $('#MaGoiCuocLogin').val("");
}


function OnSuccessLogin(data, status, xhr) {
    if (xhr.responseJSON.success) {
        location.reload();
    }
    else {
        
        loginAtempCount += 1;
        if (loginAtempCount >= 3) {

            $('#captchaLogin').removeClass("hidden");
        }

        $('#noti').removeClass('bg-green');
        $('#noti').addClass('bg-yellow');
        document.getElementById('noidungthongbao').innerText = xhr.responseJSON.error.message;
        $('#thongBaoDangNhap').modal('show');
    }
   
}

function OnFailureLogin(data, status, xhr) {

    console.log(data);
    console.log(status);
    console.log(xhr);
}

function getPwdEncrypt() {
    var passwordValue = $('#pwd-field').val();
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(`MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHVD2kA1aFkJUiPQ94lv1+ew1PRYSn9bjjEppwi4MdLmM6D6PJNMNem1ObKpfesOFlv5C9jQ3FuToxpDeq+wHYCeue02yOX6tRmA2oBwIZehc2eOVaZFEpZJ/4EjVDnxQ8QYgXqH4YJOWgSOAbGND3LkeHJO1h+8PSq0J50HpAnLAgMBAAE=`);
    var encrypted = encrypt.encrypt(passwordValue);
    $('#passwordEncrypted').val(encrypted);
}

function getTenancyName() {
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
}

function oncloseModalDangKyGoiCuoc() {
    end = new Date();
    $('#nhanMaXacThucBtnDangKyGoiCuoc').html('Nhận mã xác thực qua SMS');
    $('#MaXacThucDangKyGoiCuoc').prop('disabled', true);
}

function OnFailureDangKyGoiCuoc(data, status, xhr) {

}

function OnSuccessDangKyGoiCuoc(data, status, xhr) {

    console.log(data);

    if (data.result.success) {

    } else {
    }
}


