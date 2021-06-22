# 統計情報収集ライブラリ (sulfur library API)

\<script\> で読み込む

```html
<script src="./sulfur.js "></script>
```

## TODO

- 確認 [umd のバンドラーによって global のオブジェクトへのはやし方に違いがあるので気をつけて]

## Constructor

ライブラリオブジェクトの生成

Constructor(options)

```javascript
const sulfur = new Sulfur(options);
```

| Name    | Type   | Required | Default | Description              |
| ------- | ------ | :------: | :-----: | ------------------------ |
| url     | string |    x     |    -    | 送信先エンドポイント     |
| collect | number |    x     |  1000   | 統計情報収集インターバル |
| send    | number |    x     |  5000   | 統計情報送信インターバル |

## open

統計情報収集開始

open(peer, connection, video)

```javascript
const peer = new Peer({
  key: API_KEY,
});

const sulfur = new Sulfur();

...
// 発信時
const connection = peer.call(remoteId, localStream);
sulfur.open(peer, connection, video);

...
// 着信時
peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);
  sulfur.open(peer, mediaConnection, video);
});
```

| Name       | Type                                                                                        | Required | Default | Description                                |
| ---------- | ------------------------------------------------------------------------------------------- | :------: | :-----: | ------------------------------------------ |
| peer       | [Peer](https://webrtc.ecl.ntt.com/api-reference/javascript.html#peer)                       |    o     |    -    | SkyWay API の Peer オブジェクト            |
| connection | [MediaConnection](https://webrtc.ecl.ntt.com/api-reference/javascript.html#mediaconnection) |    o     |    -    | SkyWay API の MediaConnection オブジェクト |
| video      | HTMLVideoElement                                                                            |    o     |    -    | 通話用の Video Element                     |

## close

統計情報収集終了
end をつけてデータを送信する

close()

```javascript
connection.close(true);
sulfur.close();
```

mute 関連いらない

## setMute

統計情報に mute フラグをつける

video を mute 時に実行

setMute()

```javascript
connection.on("data", (data) => {
  if (data === "mute") {
    sulfur.setMute();
  }
});
```

## unsetMute

統計情報の mute フラグを取り外す

video を unmute 時に実行

unsetMute()

```javascript
connection.on("data", (data) => {
  if (data === "unmute") {
    sulfur.unsetMute();
  }
});
```

## Events

### Event:'error'

エラーが発生した場合のイベント

```javascript
sulfur.on("error", (e) => {
  // ...
});
```

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| error | Error | エラーオブジェクト |

| Type       | Description                              |
| ---------- | ---------------------------------------- |
| open       | 統計情報収集開始に失敗                   |
| connection | 統計情報収集サーバとのコネクションに失敗 |

### Event:'opened'

```javascript
sulfur.on("opened", (url, collect, send) => {
  // ...
});
```

統計情報収集を開始した場合のイベント

| Name    | Type   | Description              |
| ------- | ------ | ------------------------ |
| url     | string | 送信先エンドポイント     |
| collect | number | 統計情報収集インターバル |
| send    | number | 統計情報送信インターバル |

### Event:'closed'

統計情報収集を終了した場合のイベント

```javascript
sulfur.on("closed", (countsOfCollects, countsOfSend) => {
  // ...
});
```

| Name             | Type   | Description      |
| ---------------- | ------ | ---------------- |
| countsOfCollects | number | 統計情報収集回数 |
| countsOfSend     | number | 統計情報送信回数 |

## フィルタ処理

RTCStats のデータは getStats で取得したすべてのデータを送るわけではなく以下の条件でフィルタしたデータを送信する

| type             | 個数 | 条件                                     |
| ---------------- | ---- | ---------------------------------------- |
| transport        | 1    | dtlsState == 'connected' or 'connecting' |
| candidate-pair   | 1    | id == transport.selectedCandidatePairId  |
| local-candidate  | 1    | id == candidate-pair.localCandidateId    |
| remote-candidate | 1    | id == candidate-pair.remoteCandidateId   |
| inbound-rtp      | 2    | transportId == transport.id              |
| track            | 2    | id == inbound-rtp.trackId                |
| codec            | 2    | id == inbound-rtp.codecId                |
