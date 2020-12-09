function OpenPop(){
    $("#PopUp").show();
}

function CreateAccount(){
    let createId = $("#idValue").val();
    let createPw = $("#pwValue").val();
    if (createId == '') {
        alert('가문을 밝히시오');
        return;
    }
    if (createPw == '') {
        alert('문호를 증명하시오');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/user/create",
        data: {id_give: createId, pw_give: createPw},
        success: function (response) {
            if (response["result"] == "success") {
                alert('입궐하셔도 좋소')
                window.location.reload();
            } else {
                alert('문벌을 사칭하지마시오')
            }
        }
    })
}

function Login(){
    let user_id = $("#idValue").val();
    let user_pw = $("#pwValue").val();
    if (user_id == '') {
        alert('가문을 밝히시오');
        return;
    }
    if (user_pw == '') {
        alert('문호를 증명하시오');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/user/login",
        data: {id_give: user_id, pw_give: user_pw},
        success: function (response) {
            if (response["result"] == "success") {
                alert('입궐하시오')
                window.location.reload();
            } else {
                alert('입궐할수없소')
            }
        }
    })
}

function Logout(){
    $.ajax({
        type: "GET",
        url: "/user/logout",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                alert('잘가시오')
                location.href='/';
            } else {
                alert('오류')
            }
        }
    })
}

function PopupID(){
    $.ajax({
        type: "GET",
        url: "/idcheck",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["id"])
                window.location.reload();
            } else {
                alert('실패')
            }
        }
    })
}

function Popdown(){
    $("#PopUp").hide();
    $("#pozol").hide();
}
