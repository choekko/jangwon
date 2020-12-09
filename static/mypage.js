function showMySams() {
    $.ajax({
        type: "GET",
        url: "/sam/myread",
        data: {},
        success: function (response) {
            let mysams = response["mysam_list"];
            for (let i=0; i<mysams.length; i++) {
                makeMysam(mysams[i]);
            }
        }
    })
}

function makeMysam(mysam) {
    let id = mysam["id"]
    let first = mysam["first"]
    let second = mysam["second"]
    let third = mysam["third"]
    let date = mysam["date"]
    let like_cnt = mysam["like_cnt"]
    let user_id = mysam["user_id"]
    let keyword = getKeyword(date)

    let tempHtml = `<div class="box notification" style="background-image:url(../static/back.png); border-radius: 10px; color:black">
                       <div class="lines">
                                <span class="title1" style="color: black; text-shadow: 2px 2px darkgray">
                                    <span>${keyword[0]}</span>
                                </span>
                            <span class="level1">
                                    <span  style="font-size: 30px; font-weight: 400">${first}</span>
                                </span>
                            <br></br>
                            <span class="title2" style="color: black; text-shadow: 2px 2px darkgray">
                                    <span >${keyword[1]}</span>
                                </span>
                            <span class="level2 is-size-5">
                                    <span style="font-size: 30px; font-weight: 400">${second}</span>
                                </span>
                            <br></br>
                            <span class="title3" style="color: black; text-shadow: 2px 2px darkgray">
                                    <span>${keyword[2]}</span>
                                </span>
                            <span class="level3 is-size-5">
                                    <span style="font-size: 30px; font-weight: 400">${third}</span>
                                </span>
                            <br></br>
                        </div>
                        <div class="likes">
                            <span class="level-item">
                                <div id="sign" style="width:40px; height:40px; display: block"></div>
                                <span>&nbsp;${like_cnt}</span>
                            </span>
                        </div>
                        <div class="level-right is-size-4">
                            ${date}
                        </div>
                    </div>`
    $("#my-sam-list").append(tempHtml);
}