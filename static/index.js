

// index.html 관련 함수

function showSamAddCard() {
    $(".layer-popup").hide();
    $('#sam-add-card').show();
}

function hideSamAddCard() {
    $('#sam-add-card').hide();
    $('#sam-add-card input').val('');
}

// sam 저장, 수정, 삭제

function createSam() {
    let first = $("#sam-first").val();
    let second = $("#sam-second").val();
    let third = $("#sam-third").val();

    if (first == '' || second == '' || third == '') {
        alert('빈 칸을 채워주세요');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/sam/create",
        data: {
            first_give: first,
            second_give: second,
            third_give: third,
        },
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["message"]);
                window.location.reload();
            } else {
                alert("서버 오류!")
            }
        }
    })
}

function readSam() {
    $('#sam-list').empty();

    $.ajax({
        type: "GET",
        url: "/sam/read",
        data: {
        },
        success: function (response) {
            if (response['result'] == 'success') {
                let sams = response['sam_list']
                for (let i = sams.length-1; i >= 0; i--) {
                    let sam = sams[i]
                    $('#sam-list').append(makeSamCard(sam))
                }

            } else {
                alert("서버 오류!")
            }
        }
    })
}

function makeSamCard(sam){
    let id = sam['_id']
    let first = sam['first']
    let second = sam['second']
    let third = sam['third']
    let user_id = sam['user_id']
    let like_count = sam['like_cnt']
    let keyword = getKeyword(sam['date'])
    let card = `
                <div class="card" style="background-image:url(../static/back.png); padding: 3px; margin-bottom: 4px;" >
                    <div class="card-content" style="padding : 10px 20px">
                        <div class="sam-text">
                            <div>
                                <p>${keyword[0]} : ${first}</p>
                            </div>
                            <div>
                                <p>${keyword[1]} : ${second}</p>
                            </div>
                            <div>
                                <p>${keyword[2]} : ${third}</p>
                            </div>
                            <div class="content-edit">
                               <span class="icon is-medium pointer" onclick="deleteSam('${id}')">
                                   <i class="fas fa-lg fa-times"></i>
                               </span>
                           </div>
                        </div>
                        <div>
                            <span style="font-size: 24px"> 작성자 : ${user_id}</span>
                        </div>
                        <div>
                            <span class="icon is-medium pointer" onclick="likeUp('${id}')">
                                <i class="fas fa-lg fa-stamp fa-2x"></i>
                            </span>
                            <span style="font-size: 2em">&nbsp ${like_count}</span>
                        </div>
                    </div>
                </div>
               `
    return card
}

function deleteSam(id) {
    $.ajax({
        type: "POST",
        url: "/sam/delete",
        data: {
            id_give : id,
            user_id_give : "user_id"
        },
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["message"]);
                window.location.reload();
            } else {
                alert("서버 오류!")
            }
        }
    })
}

function likeUp(id){
    $.ajax({
        type: "POST",
        url: "/sam/like",
        data: {
            id_give : id,
        },
        success: function (response) {
            if (response["result"] == "success") {
                alert(response["message"]);
                window.location.reload();
            } else {
                alert("서버 오류!")
            }
        }
    })
}

function showRank(){
    $.ajax({
        type: "GET",
        url: "/rank/read",
        data: {
        },
        success: function (response) {
            if (response['result'] == 'success') {
                let ranks = response['ranks']
                $("#rank-1").text(ranks[0])
                $("#rank-2").text(ranks[1])
                $("#rank-3").text(ranks[2])
            } else {
                alert("서버 오류!")
            }
        }
    })
}

function getKeyword(date){
    let keyword = ""
    $.ajax({
        type: "POST",
        url: "/keyword/read",
        async:false,
        data: {
            date_give: date
        },
        success: function (response) {
            if (response["result"] == "success") {
                console.log(response["keyword"]["keyword"])
                keyword = response["keyword"]["keyword"]
            } else {
                console.log("단어 조회 실패!")
            }
        }
    })
    return keyword
}


function setKeyword(){
    let keyword = getKeyword(getToday())
    console.log(keyword)
    $('#keyword-first').text(keyword[0] + " : ")
    $('#keyword-second').text(keyword[1] + " : ")
    $('#keyword-third').text(keyword[2] + " : ")
    $('#keyword').text(keyword)
}

function getToday(){
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}