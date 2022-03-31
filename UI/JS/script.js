let nextId = 100;
let nextCommentId = 100;

class Tweet {
  _id;

  _createdAt;

  _author;

  text;

  comments = [];

  constructor(tweetText, user) {
    nextId += 1;
    this._id = nextId.toString();
    this.text = tweetText;
    this._createdAt = new Date();
    this._author = user;
  }

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get createdAt() {
    return this._createdAt;
  }

  static validate(tw) {
    if (!(tw instanceof Tweet)) return false;
    if ((tw.id === undefined) || (tw.id === '') || (tw.text === undefined) || (tw.text === '') || (tw.createdAt === undefined) || (tw.createdAt === '') || (tw.author === undefined) || (tw.author === '') || (tw.comments === undefined)) {
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
    nextCommentId += 1;
    this._id = nextCommentId.toString();
    this.text = commentText;
    this._createdAt = new Date();
    this._author = user;
  }

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get createdAt() {
    return this._createdAt;
  }

  static validate(com) {
    if (!(com instanceof Comment)) return false;
    if ((com.id === undefined) || (com.id === '') || (com.text === undefined) || (com.text === '') || (com.createdAt === undefined) || (com.createdAt === '') || (com.author === undefined) || (com.author === '')) {
      return false;
    }
    return com.text.length <= 280;
  }
}

class TweetCollection {
  _tweets = new Map();

  _user;

  get user() {
    return this._user;
  }

  set user(newUser) {
    this._user = newUser;
  }

  constructor(arrayOfTweets) {
    for (let i = 0; i < arrayOfTweets.length; ++i) {
      if (Tweet.validate(arrayOfTweets[i])) {
        this._tweets.set(arrayOfTweets[i].id, arrayOfTweets[i]);
      }
    }
  }

  clear() {
    this._tweets.clear();
  }

  getPage(skip = 0, top = 10, filterConfig = undefined) {
    const tempArray = [...this._tweets.values()];
    let arrayTweet = [];
    if (filterConfig !== undefined) {
      if ('hashtags' in filterConfig) {
        for (let i = 0; i < filterConfig.hashtags.length; ++i) {
          if (filterConfig.hashtags[i][0] !== '#' || filterConfig.hashtags[i].includes(' ') || filterConfig.hashtags[i].toLowerCase() !== filterConfig.hashtags[i] || filterConfig.hashtags[i].includes('#', 1)) {
            filterConfig.hashtags.splice(i, 1);
            i -= 1;
          }
        }
      }
      arrayTweet = tempArray.filter((current) => {
        let isHashtags = false;
        if ('hashtags' in filterConfig) {
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
          (!('author' in filterConfig) || filterConfig.author === current.author)
                    && (!('dateFrom' in filterConfig) || filterConfig.dateFrom < current.createdAt)
                    && (!('dateTo' in filterConfig) || filterConfig.dateTo > current.createdAt)
                    && (!('text' in filterConfig) || current.text.includes(filterConfig.text))
                    && (!('hashtags' in filterConfig) || isHashtags)
        ) return true;
        return false;
      });
    } else {
      arrayTweet = tempArray;
    }
    arrayTweet.sort((a, b) => b.createdAt - a.createdAt);
    return arrayTweet.slice(skip, top);
  }

  get(currentId) {
    return this._tweets.get(currentId);
  }

  add(tweetText) {
    const temp = new Tweet(tweetText, this._user);
    if (Tweet.validate(temp)) {
      this._tweets.set(temp.id, temp);
      return true;
    }
    return false;
  }

  addAll(arrayOfTweets) {
    const temp = [];
    for (let i = 0; i < arrayOfTweets.length; ++i) {
      if (Tweet.validate(arrayOfTweets[i])) {
        this._tweets.set(arrayOfTweets[i].id, arrayOfTweets[i]);
      } else {
        temp.push(arrayOfTweets[i]);
      }
    }
    return temp;
  }

  edit(currentId, tweetText) {
    const temp = this.get(currentId);
    if (temp === undefined || temp.author !== this._user || (tweetText.length > 280)) {
      return false;
    }
    temp.text = tweetText;
    return true;
  }

  remove(currentId) {
    const temp = this.get(currentId);
    if (temp !== undefined && temp.author === this._user) {
      this._tweets.delete(currentId);
      return true;
    }
    return false;
  }

  addComment(currentId, commentText) {
    const temp = new Comment(commentText, this._user);
    if (Comment.validate(temp) && this.get(currentId) !== undefined) {
      this.get(currentId).comments.push(temp);
      return true;
    }
    return false;
  }
}

const tweet1 = new Tweet('Some text #text #me', 'Darth_Santa');
const tweet2 = new Tweet('Some nonsense #invaLId3ehashtag55s #text', 'Darth_Santa');
const tweet3 = new Tweet('Some text #rrr teeeeext', 'UnknownUser1');
const tweet4 = new Tweet('teeeeext', 'Darth_Santa');
const tweets = new TweetCollection([tweet1, tweet2, tweet3, tweet4]);

class HeaderView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display() {
    this._div.innerHTML = tweets.user;
  }
}

class TweetFeedView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display(skip = 0, top = 10, config = undefined) {
    const arr = tweets.getPage(skip, top, config);
    let temp = '';
    for (let i = 0; i < arr.length; i++) {
      temp += `<div class = "twit row">
                    <div class="userInfo column">
                        <img src="../img/ava.svg" alt="avatar">
                        <p>${arr[i].author}</p>
                        <p>${arr[i].createdAt.getDay()}.${arr[i].createdAt.getMonth()}.${arr[i].createdAt.getFullYear()} ${arr[i].createdAt.getHours()}:${arr[i].createdAt.getMinutes()} </p>
                    </div>
                    <div class="twitText">
                        <p>${arr[i].text}</p>
                    </div>
                    <div class="twitComments row">
                        <img src="../img/comment.svg" alt="comment">
                        <p>${arr[i].comments.length}</p>
                    </div>
                </div>`;
    }
    this._div.innerHTML = temp;
  }
}

class FilterView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }
}

class TweetView {
  _divTweet;

  _divComments;

  constructor(firstElementId, secondElementId) {
    this._divTweet = document.getElementById(firstElementId);
    this._divComments = document.getElementById(secondElementId);
  }

  display(id) {
    const tw = tweets.get(id);
    const temp1 = `<div class="userInfo column">
                <img src="../img/myAva.svg" alt="avatar">
                <p>${tw.author}</p>
                <p>${tw.createdAt.getDay()}.${tw.createdAt.getMonth()}.${tw.createdAt.getFullYear()} ${tw.createdAt.getHours()}:${tw.createdAt.getMinutes()}</p>
            </div>
            <div class="twitText">
                <p>${tw.text}</p>
            </div>
            <div class="twitComments column">
                <div class="row">
                    <img src="../img/comment.svg" alt="comment">
                    <p>${tw.comments.length}</p>
                </div>
                <div class="editTools row">
                    <img src="../img/edit.svg" alt="edit">
                    <img src="../img/deleteTwit.svg" alt="delete">
                </div>
            </div>`;
    let temp2 = '';
    const arr = tw.comments;
    for (let i = 0; i < arr.length; i++) {
      temp2 += `
        <div class = "comment twit row">
            <div class="userInfo row">
                <img src="../img/ava.svg" alt="avatar">
                <div class="twitUserInfo column">
                    <p>${arr[i].author}</p>
                        <p>${arr[i].createdAt.getDay()}.${arr[i].createdAt.getMonth()}.${arr[i].createdAt.getFullYear()} ${arr[i].createdAt.getHours()}:${arr[i].createdAt.getMinutes()} </p>
                </div>
            </div>
            <div class="twitText">
                <p>${arr[i].text}</p>
            </div>
        </div>`;
    }
    this._divTweet.innerHTML = temp1;
    this._divComments.innerHTML = temp2;
  }
}

const headerView = new HeaderView('nickname');
const tweetFeedView = new TweetFeedView('tweets');
const filterView = new FilterView('filters');
const tweetView = new TweetView('selectedTweet', 'tweetComments');

function setCurrentUser(tempUser) {
  tweets.user = tempUser;
  headerView.display();
}

function addTweet(tweetText) {
  tweets.add(tweetText);
  tweetFeedView.display();
}

function editTweet(id, text) {
  tweets.edit(id, text);
  tweetFeedView.display();
}

function removeTweet(id) {
  tweets.remove(id);
  tweetFeedView.display();
}

function getFeed(skip, top, filterConfig) {
  tweetFeedView.display(skip, top, filterConfig);
}

function showTweet(id) {
  if (tweets.get(id) !== undefined) tweetView.display(id);
}

// мне не хватило времени перенести всё по отдельным файлам, поэтому тесты для main.html и twit.html конфликтуют между собой. Я распределил их по блокам, просьба закоментировать один, прежде чем запускать другой. Скоро этот недочёт будет исправлен

setCurrentUser('pavel');
console.log(tweets.addComment('101', 'arararrararararrarrrrrrr'));
getFeed(0, 4);
addTweet('Newwwww tweet1');
removeTweet('105');
addTweet('Newwwww tweet2');
editTweet('106', 'text edited');

// setCurrentUser('pavel');
// console.log(tweets.addComment('101', 'arararrararararrarrrrrrr'));
// console.log(tweets.addComment('101', 'arararrararararrarrrrrrr'));
// showTweet('101');
