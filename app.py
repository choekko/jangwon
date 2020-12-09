from pymongo import MongoClient, DESCENDING, ASCENDING
from flask import Flask, render_template, jsonify, request, session
import bcrypt
from datetime import datetime
import time
from bson.objectid import ObjectId
import random

client = MongoClient('localhost', 27017)
# client = MongoClient('mongodb://test:test@localhost', 27017)
db = client.jangwon
app = Flask(__name__)
app.secret_key = "secretsecret"

# HTML 화면 보여주기
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/myPage')
def myPage():
    return render_template('mypage.html')

@app.route('/unAuthorized')
def unAuthorized():
    return render_template('unAuthorized.html')

# 삼행시 CRUD API
@app.route('/sam/create', methods=['POST'])
def create_sam():
    if 'id' not in session:
        message = "입궐 먼저 하시오"
    else:
        user_id = session['id']
        # 날짜
        sam_check = db.sam.find_one({'user_id':user_id})
        if sam_check is not None:
            message = "이미 쓰셨잖소"
        else:
            first_receive = request.form['first_give']
            second_receive = request.form['second_give']
            third_receive = request.form['third_give']
            date = datetime.today().strftime("%Y%m%d")
            now = time.strftime("%H%M%S")

            sam = {'first': first_receive, 'second': second_receive,
                   'third': third_receive, 'user_id': user_id,
                   'date': date, 'time': now, 'like_list': [], 'like_cnt': 0
                   }

            db.sam.insert_one(sam)
            message = "삼행시 추가!"

    return jsonify({'result': 'success', 'message':message})

@app.route('/sam/read', methods=['GET'])
def read_sam():
    today = datetime.today().strftime("%Y%m%d")
    sams = list(db.sam.find({'date':today}))
    for sam in sams:
        sam['_id'] = str(sam['_id'])

    return jsonify({'result': 'success', 'sam_list': sams})

@app.route('/sam/myread', methods=['GET'])
def myread_sam():
    if 'id' not in session:
        message = "입궐 먼저 하시오"
    else:
        user_id = session['id']
        mysams = list(db.sam.find({'user_id':user_id}).sort("date", DESCENDING))
        for mysam in mysams:
            mysam['_id'] = str(mysam['_id'])
        return jsonify({'result': 'success', 'mysam_list': mysams})

@app.route('/sam/delete', methods=['POST'])
def delete_sam():
    if 'id' not in session:
        message = "입궐 먼저 하시오"
    else:
        user_id = session['id']
        id_receive = request.form['id_give']
        sam = db.sam.find_one({'_id': ObjectId(id_receive)})
        if user_id != sam['user_id']:
            message = "당신 것이 아니잖소"
        else:
            message = "삭제되었소"
            db.sam.delete_one({'_id': ObjectId(id_receive)})

    return jsonify({'result': 'success', 'message':message})

@app.route('/sam/like', methods=['POST'])
def like_sam():
    if 'id' not in session:
        message = "입궐 먼저 하시오"
        like_status = "likeNone"
    else:
        id_receive = request.form['id_give']
        user_id = session['id']
        sam = db.sam.find_one({'_id': ObjectId(id_receive)})
        print(user_id, sam)
        if user_id in sam['like_list']:
            message = "좋아요 취소"
            like_status = "likeDown"
            like_list = sam['like_list']
            like_list.remove(user_id)
            db.sam.update_one({'_id': ObjectId(id_receive)},
                              {'$set': {'like_list': like_list,
                                        'like_cnt': sam['like_cnt'] - 1}})
        else:
            message = "좋아요"
            like_status = "likeUp"
            like_list = sam['like_list']
            like_list.append(user_id)
            db.sam.update_one({'_id': ObjectId(id_receive)},
                              {'$set': {'like_list': like_list,
                                        'like_cnt': sam['like_cnt'] + 1}})
        print(message)
    return jsonify({'result': 'success', 'message': message,
                    'like_status': like_status})

@app.route('/rank/read', methods=['GET'])
def read_rank():
    today = datetime.today().strftime("%Y%m%d")
    ranks = list(db.sam.find({'date': today}).sort([("like_cnt", DESCENDING),("time", ASCENDING)]).limit(3))
    ranks = list(map(lambda x:x['user_id'], ranks))
    while len(ranks) < 2:
        ranks.append("")
    return jsonify({'result': 'success', 'ranks': ranks})

@app.route('/user/create', methods=['POST'])
def create():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    value = db.user.find_one({'id': id_receive})
    if value is None:
        createOne = {'id': id_receive, 'pw': pw_receive}
        db.user.insert_one(createOne)
        return jsonify({'result': 'success'})
    return jsonify({'result': 'fail'})

@app.route('/user/login', methods=['POST'])
def login_user():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    user = db.user.find_one({'id': id_receive})
    if user is None or user['pw'] != pw_receive:
        return jsonify({'result': 'fail'})
    session['id'] = user['id']
    return jsonify({'result': 'success'})

@app.route('/user/logout', methods=['GET'])
def logout_user():
    session.clear()
    return jsonify({'result': 'success'})

@app.route('/idcheck', methods=["GET"])
def user_only():
    if 'id' in session:
        id = session['id']
    else:
        id = '없음'
    return jsonify({'result': 'success', 'id': id})


@app.route('/keyword/read', methods=['POST'])
def get_keyword():
    date_receive = request.form['date_give']
    keyword = db.keywords.find_one({'date': date_receive},{'_id':False})
    if keyword is None:
        keyword = {'date': date_receive, 'keyword': generateKeyword()}
        db.keywords.insert_one(keyword)
        keyword = db.keywords.find_one({'date': date_receive}, {'_id': False})
    return jsonify({'result': 'success', 'keyword': keyword})

def generateKeyword():
    words = ['나무꾼', '나침반', '나이스', '나침반', '내용물', '냉장고']
    return random.choice(words)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
