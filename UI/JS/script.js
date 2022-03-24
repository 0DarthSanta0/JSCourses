let nextId = 100;
let nextCommentId = 100;

class Tweet {
    _id;
    _createdAt;
    _author;
    text;
    comments = [];
    constructor(tweetText, user) {
        ++nextId;
        this._id = nextId.toString();
        this.text = tweetText;
        this._createdAt = new Date();
        this._author = user;
    }
    get getId () {
        return this._id;
    }
    get getAuthor () {
        return this._author;
    }
    get getCreatedAt () {
        return this._createdAt;
    }
    set setId (newId) {
        this._id = newId;
    }
    set setAuthor (newAuthor) {
        this._author = newAuthor;
    }
    set setCreatedAt (newDate) {
        this._createdAt = newDate;
    }
    static validate(tw) {
        if (!(tw instanceof Tweet)) return false
        if ((tw._id === undefined) || (tw.text === undefined) || (tw._createdAt === undefined) || (tw._author === undefined) || (tw.comments === undefined)) {
            return false;
        }
        return tw.text.length <= 280;
    }
}

class Comment {
    _id;
    _createdAt;
    _author;
    text;
    constructor(commentText, user) {
        ++nextCommentId;
        this._id = nextCommentId.toString();
        this.text = commentText;
        this._createdAt = new Date();
        this._author = user;
    }
    get getId () {
        return this._id;
    }
    get getAuthor () {
        return this._author;
    }
    get getCreatedAt () {
        return this._createdAt;
    }
    set setId (newId) {
        this._id = newId;
    }
    set setAuthor (newAuthor) {
        this._author = newAuthor;
    }
    set setCreatedAt (newDate) {
        this._createdAt = newDate;
    }
    static validate(com) {
        if (!(com instanceof Comment)) return false
        if ((com._id === undefined) || (com.text === undefined) || (com._createdAt === undefined) || (com._author === undefined)) {
            return false;
        }
        return com.text.length <= 280;
    }
}

class TweetCollection {
    _tweets = new Map();
    _user;

    get getUser () {
        return this._user;
    }

    set setUser (newUser) {
        this._user = newUser;
    }

    constructor(arrayOfTweets) {
        for (let i = 0; i < arrayOfTweets.length; ++i) {
            if (Tweet.validate(arrayOfTweets[i])) {
                this._tweets.set(arrayOfTweets[i].getId, arrayOfTweets[i]);
            }
        }
    }

    clear () {
        this._tweets.clear();
        this._user = undefined;
    }

    getPage(skip = 0, top = 10, filterConfig) {
        let tempArray = [];
        for (let current of this._tweets.values()) {
            tempArray.push(current);
        }
        tempArray.sort((a, b) => {
            return b._createdAt - a._createdAt;
        });
        let arrayTweet = [];
        if (filterConfig !== undefined) {
            if ("hashtags" in filterConfig) {
                for (let i = 0; i < filterConfig.hashtags.length; ++i) {
                    if (filterConfig.hashtags[i][0] != "#" || filterConfig.hashtags[i].includes(" ") || filterConfig.hashtags[i].toLowerCase() != filterConfig.hashtags[i] || filterConfig.hashtags[i].includes("#", 1)) {
                        filterConfig.hashtags.splice(i, 1);
                        --i;
                    }
                }
            }
            arrayTweet = tempArray.filter(function (current) {
                let isHashtags = false;
                if ("hashtags" in filterConfig) {
                    for (let i = 0; i < filterConfig.hashtags.length; ++i) {
                        if (current.text.includes(filterConfig.hashtags[i])) {
                            isHashtags = true;
                        } else {
                            isHashtags = false;
                            break;
                        }
                    }
                }
                if (
                    (!("author" in filterConfig) || filterConfig.author === current._author) &&
                    (!("dateFrom" in filterConfig) || filterConfig.dateFrom < current._createdAt) &&
                    (!("dateTo" in filterConfig) || filterConfig.dateTo > current._createdAt) &&
                    (!("text" in filterConfig) || current.text.includes(filterConfig.text)) &&
                    (!("hashtags" in filterConfig) || isHashtags)
                ) return true;
                return false;
            })
        } else {
            arrayTweet = tempArray;
        }
        this._tweets.clear();
        for (let i = 0; i < tempArray.length; ++i) {
            this._tweets.set(tempArray[i].getId, tempArray[i]);
        }
        return arrayTweet.slice(skip, top);
    }

    get(currentId) {
        return this._tweets.get(currentId);
    }

    add(tweetText) {
        let temp = new Tweet(tweetText, this._user);
        if (Tweet.validate(temp)) {
            this._tweets.set(temp._id, temp);
            return true;
        }
        return false;
    }

    addAll (arrayOfTweets) {
        let temp = [];
        for (let i = 0; i < arrayOfTweets.length; ++i) {
            if (Tweet.validate(arrayOfTweets[i])) {
                this._tweets.set(arrayOfTweets[i].getId, arrayOfTweets[i]);
            } else {
                temp.push(arrayOfTweets[i]);
            }
        }
        return temp;
    }

    edit (currentId, tweetText) {
        let temp = this.get(currentId);
        if (temp === undefined || temp._author !== this._user || !Tweet.validate(temp) || (tweetText.length > 280)) {
            return false;
        }
        temp.text = tweetText;
        return true;
    }

    remove (currentId) {
        let temp = this.get(currentId);
        if (temp !== undefined && temp._author === this._user) {
            this._tweets.delete(currentId);
            return true;
        }
        return false;
    }

    addComment (currentId, commentText) {
        let temp = new Comment(commentText, this._user);
        if (Comment.validate(temp) && this.get(currentId) !== undefined) {
            this.get(currentId).comments.push(temp);
            return true;
        }
        return false;
    }
}

console.log("Создание твитов");
let tweet1 = new Tweet("Some text #text #me", "Darth_Santa");
let tweet2 = new Tweet("Some nonsense #invaLId3ehashtag55s #text", "Darth_Santa");
let tweet3 = new Tweet("Some text #rrr teeeeext", "UnknownUser1");
let tweet4 = new Tweet("teeeeext", "Darth_Santa");
let tweet5 = new Tweet("teeeeext", "UnknownUser1");
let tweet6 = new Tweet("teeeee", "UnknownUser1");
let tweet7 = new Tweet("tee", "UnknownUser2");
let badTweet8 = new Tweet();
console.log("Изменение даты твита");
tweet3.setCreatedAt = ((new Date('2011-03-09T23:00:01')));
const mas = [tweet1, tweet2, tweet3, tweet4];
const mas2 = [tweet5, tweet6, tweet7, badTweet8];
console.log(mas);
console.log("Создание коллекции");
let coll = new TweetCollection(mas);
coll.setUser = "Darth_Santa";
console.log(coll.getPage(0, 10));
console.log("Добавить твиты из массива и вернуть невалидные");
console.log(coll.addAll(mas2));
console.log(coll.getPage(0, 10));
console.log("Вывести три последних добавленных");
console.log(coll.getPage(0, 3));
console.log("Фильтр по всем критериям");
console.log(coll.getPage(0, 2, {author: "Darth_Santa", dateTo: new Date("2023-03-01T23:00:00"), dateFrom: new Date("2011-07-01T23:00:00"), hashtags: ["#text", "#me"], text: "Some"}));
console.log("Фильтр по автору и дате");
console.log(coll.getPage(0, 10, {author: "UnknownUser1", dateTo: new Date("2022-03-01T23:00:00")}));
console.log("Фильтр по двум хештегам (оба есть)");
console.log(coll.getPage(0, 10, {hashtags: ["#text", "#me"]}));
console.log("Фильтр по двум хештегам (одного нет)");
console.log(coll.getPage(0, 10, {hashtags: ["#text", "#jfhjuhf"]}));
console.log("Фильтр по двум хештегам (один не валиден. в таком случае я считал, что не валидных хештегов просто нет в списке передающихся)");
console.log(coll.getPage(0, 10, {hashtags: ["#text", "#jKDjifjiM#juhf"]}));
console.log("Твит с id 101");
console.log(coll.get("101"));
console.log("Проверить твит из coll");
console.log(Tweet.validate(tweet1));
console.log("Проверить твит с недостающими параметрами");
let badTweet = new Tweet();
console.log(Tweet.validate(badTweet));
console.log("Добавить твит");
console.log(coll.add("new tweeeeet"));
console.log("Добавить твит с текстом большим за 280 символов");
console.log(coll.add("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
console.log(coll.getPage(0, 10));
console.log("Изменить твит (успешно)");
console.log(coll.edit("104", "EDITED tweet"));
console.log("Изменить твит (больше за 280 символов)");
console.log(coll.edit("101", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
console.log("Удалить твит (author != user)");
console.log(coll.remove("103"));
console.log("Удалить твит с несуществующим id");
console.log(coll.remove("2222"));
console.log("Удалить твит (author == user)");
console.log(coll.remove("102"));
coll.setUser = "Pavel";
console.log(coll.getPage(0, 10));
console.log("Добавить твит уже с другим именем пользователя");
console.log(coll.add("From Pavel"));
console.log("Проверить комментарий (валидно))");
let comment1 = new Comment("jnvhfjvf", "user74");
console.log(Comment.validate(comment1));
console.log("Проверить комментарий с недостающими параметрами");
let badComment = new Comment();
console.log(Comment.validate(badComment));
console.log("Добавить коммент");
console.log(coll.addComment("101", "arararrararararrarrrrrrr"));
console.log("Добавить коммент несуществующему твиту");
console.log(coll.addComment("222", "arararrararararrarrrrrrr"));
console.log("Добавить коммент c текстом > 280 символов");
console.log(coll.addComment("101", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
console.log(coll.getPage(0, 10));
coll.clear();
console.log("Очистить");
console.log(coll.getPage(0, 10));
