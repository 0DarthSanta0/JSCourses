const tweets = [
    {
        id: '1',
        text: 'Hi! #js #datamola',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'DarthSanta',
        comments: [],
    },
    {
        id: '2',
        text: 'Whats up?',
        createdAt: new Date('2022-03-09T23:00:01'),
        author: 'Unknown karasik',
        comments: [{
            id: '912',
            text: 'All OK. You?',
            createdAt: new Date('2022-03-09T23:00:05'),
            author: 'DarthSanta',
        }],
    },
    {
        id: '3',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '4',
        text: 'Some text #idontknowwhatthehellisgoingon #fnjJFD jf',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'DarthSanta',
        comments: [],
    },
    {
        id: '5',
        text: 'Some text #idontknowwhatthehellisgoingon #sssss',
        createdAt: new Date('2022-02-09T23:00:00'),
        author: 'DarthSanta',
        comments: [],
    },
    {
        id: '6',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '7',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '8',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '9',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '10',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '11',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '12',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik1',
        comments: [],
    },
    {
        id: '13',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'DarthSanta',
        comments: [],
    },
    {
        id: '14',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik3',
        comments: [],
    },
    {
        id: '15',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik3',
        comments: [],
    },
    {
        id: '16',
        text: 'Some text #yup #idontknowwhatthehellisgoingon',
        createdAt: new Date('2012-03-09T23:00:00'),
        author: 'Unknown karasik4',
        comments: [],
    },
    {
        id: '17',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '18',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '19',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
    {
        id: '20',
        text: 'Some text #idontknowwhatthehellisgoingon',
        createdAt: new Date('2022-03-09T23:00:00'),
        author: 'Unknown karasik',
        comments: [],
    },
]

const module = (function() {
    let user = "DarthSanta";
    let nextId = 100;
    let nextCommentId = 100;
    return {
        getTweets: function (skip = 0, top = 10, filterConfig) {
        tweets.sort((a, b) => {
            return b.createdAt - a.createdAt;
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
            arrayTweet = tweets.filter(function (current) {
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
                    (!("author" in filterConfig) || filterConfig.author === current.author) &&
                    (!("dateFrom" in filterConfig) || filterConfig.dateFrom < current.createdAt) &&
                    (!("dateTo" in filterConfig) || filterConfig.dateTo > current.createdAt) &&
                    (!("text" in filterConfig) || current.text.includes(filterConfig.text)) &&
                    (!("hashtags" in filterConfig) || isHashtags)
                ) return true;
                return false;
            })
        } else {
            arrayTweet = tweets;
        }

        return arrayTweet.slice(skip, top);
    },
        getTweet: function (currentId) {
            for (let i = 0; i < tweets.length; ++i) {
                if (currentId === tweets[i].id) {
                    return tweets[i];
                }
            }
        },
        validateTweet: function (tw) {
            if (!("id" in tw) || !("text" in tw) || !("createdAt" in tw) || !("author" in tw) || !("comments" in tw)) {
                return false;
            }
            let temp = 0;
            for (let i = 0; i < tweets.length; ++i) {
                if (tw.id === tweets[i].id) {
                    ++temp;
                }
            }
            if (temp > 1) return false
            if (tw.text.length > 280) {
                return false;
            }
            return true;
        },
        addTweet: function (tweetText) {
            ++nextId;
            let temp = {
                id: nextId.toString(),
                text: tweetText,
                createdAt: new Date(),
                author: user,
                comments: [],
            }
            if (this.validateTweet(temp)) {
                tweets.push(temp);
                return true;
            }
            return false;
        },
        editTweet: function (currentId, tweetText) {
            if (tweetText.length > 280) {
                return false;
            }
            let temp = this.getTweet(currentId);
            if (temp !== undefined) {
                if (temp.author === user) {
                    temp.text = tweetText;
                } else return false;
            } else return false;
            return true;
        },
        removeTweet: function (currentId) {
            let temp = this.getTweet(currentId);
            if (temp !== undefined) {
                if (temp.author === user) {
                    for (let i = 0; i < tweets.length; ++i) {
                        if (currentId === tweets[i].id) {
                            tweets.splice(i, 1);
                        }
                    }
                    return true;
                }
            }
            return false;
        },
        validateComment: function (com) {
            if (!("id" in com) || !("text" in com) || !("createdAt" in com) || !("author" in com)) {
                return false;
            }
            if (com.text.length > 280) {
                return false;
            }
            return true;
        },
        addComment: function (currentId, commentText) {
            ++nextCommentId;
            let temp = {
                id: nextCommentId.toString(),
                text: commentText,
                createdAt: new Date(),
                author: user,
            }
            if (this.validateComment(temp)) {
                this.getTweet(currentId).comments.push(temp);
                return true;
            }
            return false;
        },
        changeUser: function (usr) {
            user = usr;
        }
}
})();


module.getTweets();
console.log("Массив");
console.log(tweets);
console.log("Фильтр по всем критериям");
console.log(module.getTweets(0, 10, {author: "Unknown karasik4", dateTo: new Date("2013-03-01T23:00:00"), dateFrom: new Date("2011-03-01T23:00:00"), hashtags: ["#yup"], text: "text"}));
console.log("Фильтр по автору и дате");
console.log(module.getTweets(0, 10, {author: "DarthSanta", dateTo: new Date("2022-03-01T23:00:00")}));
console.log("Вернуть 13 твитов");
console.log(module.getTweets(0, 13));
console.log("Фильтр по двум хештегам (оба есть)");
console.log(module.getTweets(0, 10, {hashtags: ["#sssss", "#idontknowwhatthehellisgoingon"]}));
console.log("Фильтр по двум хештегам (одного нет)");
console.log(module.getTweets(0, 10, {hashtags: ["#sssss", "#jfhjuhf"]}));
console.log("Фильтр по двум хештегам (один не валиден. в таком случае я считал, что не валидных хештегов просто нет в списке передающихся)");
console.log(module.getTweets(0, 10, {hashtags: ["#sssss", "#jKDjifjiM#juhf"]}));
console.log("Твит с id 15");
console.log(module.getTweet("15"));
console.log("Проверить твит из tweets");
console.log(module.validateTweet({
    id: '1',
    text: 'Hi! #js #datamola',
    createdAt: new Date('2022-03-09T23:00:00'),
    author: 'DarthSanta',
    comments: [],
}));
console.log("Проверить твит с недостающими параметрами");
console.log(module.validateTweet({author: "sd"}));
console.log("Добавить твит");
console.log(module.addTweet("dbsbfgsdyufhciudsnc"));
console.log("Добавить твит с текстом большим за 280 символов");
console.log(module.addTweet("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
console.log("Изменить твит (успешно)");
console.log(module.editTweet("1", "EDITED tweet"));
console.log("Изменить твит (больше за 280 символов)");
console.log(module.editTweet("1", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
console.log("Удалить твит (author != user)");
console.log(module.removeTweet("2"));
console.log("Удалить твит с несуществующим id");
console.log(module.removeTweet("2222"));
console.log("Удалить твит (author == user)");
console.log(module.removeTweet("13"));
module.changeUser("Pavel");
console.log("Добавить твит уже с другим именем пользователя");
console.log(module.addTweet("From Pavel"));
console.log("Проверить комментарий из уже созданных");
console.log(module.validateComment({
    id: '912',
    text: 'All OK. You?',
    createdAt: new Date('2022-03-09T23:00:05'),
    author: 'DarthSanta',
}));
console.log("Проверить комментарий с недостающими параметрами");
console.log(module.validateComment({author: "sdasd"}));
console.log("Добавить коммент");
console.log(module.addComment("3", "arararrararararrarrrrrrr"));
console.log("Добавить коммент c текстом > 280 символов");
console.log(module.addComment("3", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
