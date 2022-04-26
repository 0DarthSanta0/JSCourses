let nextId = 100;
let nextCommentId = 100;
let indexOfLoadTweets = 20;

class UserCollection {
  _users = [];

  addUser(user) {
    this._users.push(user);
  }
}

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
    if (arrayOfTweets === undefined) return;
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

function getFullDate(date) {
  return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

class HeaderView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display(user) {
    this._div.innerHTML = `
        <div class="info row" id="userInfo">
            <img class="avatar" src="img/myAva.svg" alt="avatar">
            <div class="nickname" id="nickname">${user}</div>
        </div>
        <img src = "img/Logo.svg" alt="logo" class="logo">
        <div class="exitButton row">
            <img src = "img/exit.svg" alt="exit" class="exit">
        </div>
    `;
  }
}

class TweetFeedView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display(user, arr = {}) {
    let temp = '';
    for (let i = 0; i < arr.length; i++) {
      temp += `<div class = "twit row" id="${arr[i].id}">
                    <div class="userInfo column">
                        <img src="../img/ava.svg" alt="avatar">
                        <p>${arr[i].author}</p>
                        <p>${getFullDate(arr[i].createdAt)}</p>
                    </div>
                    <div class="twitText">  
                        <p>${arr[i].text}</p>
                    </div>`;
      if (user !== arr[i].author) {
        temp += `   <div class="twitComments row">
                        <button class="countOfComments"><img src="../img/comment.svg" alt="comment"></button>
                        <p>${arr[i].comments.length}</p>
                    </div>
                </div>`;
      } else {
        temp += `   <div class="twitComments column">
                        <div class="row">
                            <button class="countOfComments"><img src="../img/comment.svg" alt="comment"></button>
                            <p>${arr[i].comments.length}</p>
                        </div>
                        <div class="editTools row">
                            <button class="editButton"><img src="../img/edit.svg" alt="edit"></button>
                            <button class="deleteButton"><img src="../img/deleteTwit.svg" alt="delete"></button>
                        </div>
                    </div></div>`;
      }
    }
    this._div.innerHTML = temp;
  }
}

class FilterView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display() {
    this._div.innerHTML = `
        <h2>Filters</h2>
            <label for="authorField">Author</label>
            <div class="author row">
                <input type="text" id="authorField">
            </div>
            <p>Date of</p>
            <div class="divDate row">
                <input type="date" class="dateStart">
                <input type="date" class="dateEnd">
            </div>
            <label for="textField">Text</label>
            <div class="textField">
                <textarea id="textField"></textarea>
            </div>
            <label for="hashtags">Hashtags</label>
            <div class="hashtags row">
                <input type="text" id="hashtags">
                <img src = "img/delete.svg" alt="delete" class="delete">
            </div>
            <p class="stackOfHashtags"></p>
            <div class="buttonCase row">
                <input type="button" class="resetButton" value="Reset">
                <input type="button" class="applyButton" value="Apply">
            </div>
    `;
  }
}

class TweetView {
  _div;

  constructor(elementId) {
    this._div = document.getElementById(elementId);
  }

  display(user, tw) {
    this._div.setAttribute('class', 'twitContent column');
    let temp = `
    <div class="commentHead row">
        <button class="homeButton">
            <p>Home</p>
        </button>
        <div class = "selectedTwit twit row" id="selectedTweet">
          <div class="userInfo column">
                  <img src="../img/myAva.svg" alt="avatar">
                  <p>${tw.author}</p>
                  <p>${getFullDate(tw.createdAt)}</p>
          </div>
          <div class="twitText">
             <p>${tw.text}</p>
          </div>`;
    if (user === tw.author) {
      temp += `<div class="twitComments column">
             <div class="row">
                 <img src="../img/comment.svg" alt="comment">
                      <p>${tw.comments.length}</p>
             </div>
             <div class="editTools row">
                 <img src="../img/edit.svg" alt="edit">
                 <img src="../img/deleteTwit.svg" alt="delete">
             </div>
          </div>`;
    } else {
      temp += `<div class="twitComments row">
                        <img src="../img/comment.svg" alt="comment">
                        <p>${tw.comments.length}</p>
                    </div>
                </div>`;
    }
    temp += `
        </div>
    </div>
    <p>Comments</p>
    <div class="comments twits" id="tweetComments">`;
    const end = `</div>
    <form class = "newComment newTwit row">
        <textarea></textarea>
        <div class="row">
            <input type="button" value="Send!" class="commentButton">
        </div>
    </form>`;
    let temp1 = '';
    const arr = tw.comments;
    for (let i = 0; i < arr.length; i++) {
      temp1 += `
        <div class = "comment twit row">
            <div class="userInfo row">
                <img src="../img/ava.svg" alt="avatar">
                <div class="twitUserInfo column">
                    <p>${arr[i].author}</p>
                        <p>${getFullDate(arr[i].createdAt)} </p>
                </div>
            </div>
            <div class="twitText">
                <p>${arr[i].text}</p>
            </div>
        </div>`;
    }
    temp = temp + temp1 + end;
    this._div.innerHTML = temp;
  }
}

class TweetFeedApiService {
  _requestMethods = {
    post: 'POST',
    get: 'GET',
  };

  _endpoints = {
    login: 'login',
    tweet: 'tweet',
    registration: 'registration',
  };

  _endpoint = 'https://jslabapi.datamola.com/';

  constructor(url) {
    this._endpoint = url;
  }

  _getHeaders(isAuth) {
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'application/json');
    if (isAuth) {
      defaultHeaders.append('Authorization', `Bearer ${localStorage.token}`);
    }
    return defaultHeaders;
  }

  _getOptions(body, isAuth, method = this._requestMethods.post) {
    const defaultOptions = {
      method,
      headers: this._getHeaders(isAuth),
    };
    if (body) {
      defaultOptions.body = JSON.stringify(body);
    }
    return defaultOptions;
  }

  _request(url, options) {
    return fetch(this._endpoint + url, options)
      .then((response) => response.json());
  }

  _registrationRequest = (login, password) => {
    const options = this._getOptions({ login, password });
    return this._request(this._endpoints.registration, options);
  };

  async registration(login, password) {
    const temp = await this._registrationRequest(login, password);
    console.log(temp);
  }

  _loginRequest = (login, password) => {
    const options = this._getOptions({ login, password });
    return this._request(this._endpoints.login, options)
      .then(({ token }) => token);
  };

  async login(login, password) {
    localStorage.token = await this._loginRequest(login, password);
  }

  _tweetRequest = (text) => {
    const option = this._getOptions({ text }, true);
    return this._request(this._endpoints.tweet, option);
  };

  async addTweet(text) {
    const tw = await this._tweetRequest(text);
    console.log(tw);
  }

  _tweetsRequest = (from, count, filters) => {
    const option = this._getOptions(undefined, false, 'GET');
    return this._request(this._endpoints.tweet, option);
  };

  async getTweets() {
    const tw = await this._tweetsRequest();
    console.log(tw);
    return tw;
  }
}

class TweetsController {
  headerView;

  tweetFeedView;

  filterView;

  tweetView;

  tweets = new TweetCollection();

  currentUser;

  users = new UserCollection();

  api = new TweetFeedApiService('https://jslabapi.datamola.com/');

  constructor(headerId, tweetsId, filtersId, mainId) {
    this.headerView = new HeaderView(headerId);
    this.tweetFeedView = new TweetFeedView(tweetsId);
    this.filterView = new FilterView(filtersId);
    this.tweetView = new TweetView(mainId);
    window.addEventListener('load', () => {
      const button = document.getElementById('loadButton');
      button.addEventListener('click', () => {
        this.getFeed(0, indexOfLoadTweets);
        indexOfLoadTweets += 10;
      });
      const tw = document.getElementById('tweets');
      tw.addEventListener('click', (e) => {
        const target = e.target.parentNode;
        if (target.classList.contains('countOfComments')) {
          if (target.parentNode.classList.contains('twitComment')) {
            this.showTweet(target.parentNode.parentNode.id);
          }
          this.showTweet(target.parentNode.parentNode.parentNode.id);
        }
        if (target.classList.contains('editButton')) {
          target.parentNode.parentNode.parentNode.style = 'opacity: 0.4';
          const newTweetButtonCase = document.getElementById('newTweetButtonCase');
          newTweetButtonCase.innerHTML = `<button class="confirmEdit">Save</button>
                    <button class="resetEdit">Cancel</button>`;
          newTweetButtonCase.addEventListener('click', (event) => {
            const secondTarget = event.target;
            const text = document.getElementById('newTweetArea').value;
            if (secondTarget.classList.contains('confirmEdit')) {
              this.editTweet(target.parentNode.parentNode.parentNode.id, `${text}`);
              document.getElementById('newTweet').innerHTML = `<textarea id="newTweetArea"></textarea>
                <div class="row" id="newTweetButtonCase">
                    <input type="button" value="Tweet!" class="twitButton">
                </div>`;
            }
          });
        }
        if (target.classList.contains('deleteButton')) {
          const secondTarget = target.parentNode.parentNode;
          secondTarget.classList.add('deleted');
          const temp = secondTarget.getElementsByTagName('p')[0];
          secondTarget.innerHTML = `<p>Delete?</p>
                        <div class="row" class="deleteButtonCase">
                            <button class="resetDelete">No</button>
                            <button class="confirmDelete">Yes</button>
                        </div>`;
          secondTarget.addEventListener('click', (event) => {
            if (event.target.classList.contains('confirmDelete')) {
              this.removeTweet(secondTarget.parentNode.id);
            }
            if (event.target.classList.contains('resetDelete')) {
              this.getFeed(0, indexOfLoadTweets);
            }
          });
        }
      });
      const newTw = document.getElementById('newTweet');
      newTw.addEventListener('click', (e) => {
        if (e.target.classList.contains('twitButton')) {
          const text = document.getElementById('newTweetArea').value;
          this.addTweet(text);
          this.getFeed(0, indexOfLoadTweets);
        }
      });
    });
  }

  setCurrentUser(tempUser) {
    this.tweets.user = tempUser;
    this.headerView.display(tempUser);
  }

  addTweet(tweetText) {
    this.tweets.add(tweetText);
    const arr = this.tweets.getPage(0, 10);
    this.tweetFeedView.display(this.tweets.user, arr);
  }

  editTweet(id, text) {
    this.tweets.edit(id, text);
    const arr = this.tweets.getPage(0, 10);
    this.tweetFeedView.display(this.tweets.user, arr);
  }

  removeTweet(id) {
    this.tweets.remove(id);
    const arr = this.tweets.getPage(0, 10);
    this.tweetFeedView.display(this.tweets.user, arr);
  }

  getFeed(skip = 0, top = 10, filterConfig = undefined) {
    const arr = this.api.getTweets();
    this.tweetFeedView.display(this.tweets.user, arr);
  }

  showTweet(id) {
    const tw = this.tweets.get(id);
    if (tw !== undefined) this.tweetView.display(this.tweets.user, tw);
  }
}

const tweetsController = new TweetsController('header', 'tweets', 'filters', 'main');

tweetsController.setCurrentUser('pavel');
