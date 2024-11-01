
function loaddataforHuyen(obj, id) {
    $.ajax({
        type: 'GET',
        url: '/account/GetAllHuyenByTinhId',
        data: { "tinhId": id },
        contentType: "application/json; charset=utf-8",
        dataType: "json", async: false,
        success: function (respon) {
            var html_temp = "<option value='$id'>$title</option>";
            var len = respon.result.length;
            var data = respon.result;

            if (len > 0) {
                var html = "<option value=''> --- Chọn huyện --- </option>";
                for (var i = 0; i < len; i++) {
                    html += html_temp.replace("$id", data[i].id).replace("$title", data[i].name);
                }
                $(obj).html(html); $(obj).show();
            }
        },
        //error: function (data) { alert("Dịch vụ dữ liệu danh mục tin tức bị lỗi. Khởi động lại trình duyệt.") }
    });
}

function loaddataforXa(obj, tinhId, huyenId) {
    $.ajax({
        type: 'GET',
        url: '/account/GetAllXaByHuyenId',
        data: { "tinhId": tinhId, "huyenId": huyenId },
        contentType: "application/json; charset=utf-8",
        dataType: "json", async: false,
        success: function (respon) {
            var html_temp = "<option value='$id'>$title</option>";
            var len = respon.result.length;
            var data = respon.result;

            if (len > 0) {
                var html = "<option value=''> --- Chọn xã --- </option>";
                for (var i = 0; i < len; i++) {
                    html += html_temp.replace("$id", data[i].id).replace("$title", data[i].name);
                }
                $(obj).html(html); $(obj).show();
            }
        },
        //error: function (data) { alert("Dịch vụ dữ liệu danh mục tin tức bị lỗi. Khởi động lại trình duyệt.") }
    });
}

function onChangeTinh(ccbId, tinhId) {
    loaddataforHuyen($(ccbId), tinhId);
}
function onChangeHuyen(ccbId, cbbTinh, huyenId) {
    var tinhId = $(cbbTinh).val();
    loaddataforXa($(ccbId), tinhId, huyenId);
}


function loaddataTinh(obj) {
    $.ajax({
        type: 'GET',
        url: '/account/GetAllTinh',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json", async: false,
        success: function (respon) {
            debugger
            var html_temp = "<option value='$id'>$title</option>";
            var len = respon.result.length;
            var data = respon.result;

            if (len > 0) {
                var html = "<option value=''> --- Chọn tỉnh --- </option>";
                html += "<option><input type='text' placeholder='Tìm kiếm tên tỉnh..' id='myInput' onkeyup='filterFunction()' class='form-control'></option>"
                for (var i = 0; i < len; i++) {
                    html += html_temp.replace("$id", data[i].id).replace("$title", data[i].name);
                }
                $(obj).html(html); $(obj).show();
            }
        },
        //error: function (data) { alert("Dịch vụ dữ liệu danh mục tin tức bị lỗi. Khởi động lại trình duyệt.") }
    });
}


filterFunction = function () {
    alert();
}