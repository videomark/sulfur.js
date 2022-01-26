# 統計情報収集ライブラリ (sulfur library API)

\<script\> を使用してロードを行う

```html
<script src="https://cdn.jsdelivr.net/npm/@videomark/sulfur.js/dist/sulfur.js"></script>
```

## Constructor

ライブラリオブジェクトの生成

Constructor(options)

```javascript
const sulfur = new Sulfur(options);
```

| Name            | Type   | Required | Default | Description              |
| --------------- | ------ | :------: | :-----: | ------------------------ |
| url             | string |    x     |    -    | 送信先エンドポイント     |
| collectInterval | number |    x     |  1000   | 統計情報収集インターバル |
| sendInterval    | number |    x     |  5000   | 統計情報送信インターバル |

## open

統計情報収集開始

open(peer, connection, options)

| Name       | Type                                                                                        | Required | Default | Description                                |
| ---------- | ------------------------------------------------------------------------------------------- | :------: | :-----: | ------------------------------------------ |
| peer       | [Peer](https://webrtc.ecl.ntt.com/api-reference/javascript.html#peer)                       |    o     |    -    | SkyWay API の Peer オブジェクト            |
| connection | [MediaConnection](https://webrtc.ecl.ntt.com/api-reference/javascript.html#mediaconnection) |    o     |    -    | SkyWay API の MediaConnection オブジェクト |
| options    | Object                                                                                      |    x     |    -    | Options オブジェクト                       |

Options

| Name         | Type             | Required | Default | Description            |
| ------------ | ---------------- | :------: | :-----: | ---------------------- |
| video        | HTMLVideoElement |    x     |    -    | 通話用の Video Element |
| additionalId | string           |    x     |   ""    | additional ID          |

```javascript
const peer = new Peer({
  key: API_KEY,
});

const sulfur = new Sulfur();

...
// 発信時
const connection = peer.call(remoteId, localStream);
sulfur.open(peer, connection, {
  video: document.getElementById("remote-pid"), // 対向のpeerID
  additionalId: "additionalId"
});

...
// 着信時
peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream);
  sulfur.open(peer, mediaConnection, {
    video: document.getElementById("remote-pid"), // 対向のpeerID
    additionalId: "additionalId"
  });
});
```

## close

統計情報収集終了

close()

```javascript
connection.close(true);
sulfur.close();
```

## Events

### Event:'error'

エラーが発生した場合のイベント

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| error | Error | エラーオブジェクト |

| Type        | Description                        |
| ----------- | ---------------------------------- |
| open        | 統計情報収集開始に失敗             |
| validate    | 送信データ検証でエラーが見つかった |
| closed      | 通話相手との接続が切れた           |
| transaction | 統計情報収集サーバとの通信に失敗   |

```javascript
sulfur.on("error", (e) => {
  // ...
});
```

### Event:'opened'

統計情報収集を開始した場合のイベント

| Name    | Type   | Description              |
| ------- | ------ | ------------------------ |
| url     | string | 送信先エンドポイント     |
| collect | number | 統計情報収集インターバル |
| send    | number | 統計情報送信インターバル |

```javascript
sulfur.on("opened", (url, collect, send) => {
  // ...
});
```

### Event:'closed'

統計情報収集を終了した場合のイベント

| Name            | Type   | Description      |
| --------------- | ------ | ---------------- |
| countsOfCollect | number | 統計情報収集回数 |
| countsOfSend    | number | 統計情報送信回数 |

```javascript
sulfur.on("closed", (countsOfCollect, countsOfSend) => {
  // ...
});
```

## 値の取得方法

| 項目         | 取得方法                                       |
| ------------ | ---------------------------------------------- |
| peerId       | Peer.id                                        |
| remoteId     | MediaConnection.remoteId                       |
| apikey       | Peer.options.key                               |
| additionalId | 不明                                           |
| stats        | MediaConnection.getPeerConnection().getStats() |

## フィルタ処理

RTCStats のデータは getStats で取得し以下の条件でフィルタしたデータを送信する

| type             | 個数 | 条件                                     |
| ---------------- | ---- | ---------------------------------------- |
| transport        | 1    | dtlsState == 'connected' or 'connecting' |
| candidate-pair   | 1    | id == transport.selectedCandidatePairId  |
| local-candidate  | 1    | id == candidate-pair.localCandidateId    |
| remote-candidate | 1    | id == candidate-pair.remoteCandidateId   |
| inbound-rtp      | 2    | transportId == transport.id              |
| track            | 2    | id == inbound-rtp.trackId                |
| codec            | 2    | id == inbound-rtp.codecId                |
