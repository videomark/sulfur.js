# 統計情報収集ライブラリ (sulfur library API)

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

open(peer, connection)

```javascript
const peer = new Peer({
  key: API_KEY,
});
const connection = peer.call(remoteId, localStream);

const sulfur = new Sulfur();

sulfur.open(peer, connection);
```

| Name       | Type                                                                                        | Required | Default | Description              |
| ---------- | ------------------------------------------------------------------------------------------- | :------: | :-----: | ------------------------ |
| peer       | [Peer](https://webrtc.ecl.ntt.com/api-reference/javascript.html#peer)                       |    o     |    -    | 送信先エンドポイント     |
| connection | [MediaConnection](https://webrtc.ecl.ntt.com/api-reference/javascript.html#mediaconnection) |    o     |    -    | 統計情報収集インターバル |

## close

統計情報収集終了

close()

```javascript
connection.close(true);
sulfur.close();
```

## pause

統計情報収集一時停止

pause()

```javascript
// ミュートボタン
document.getElementById("mute-on").onclick = () => {
  localStream.getVideoTracks().forEach((track) => (track.enabled = false));
  sulfur.pause();
};
```

## start

統計情報収集再開

start()

```javascript
// ミュート解除ボタン
document.getElementById("mute-off").onclick = () => {
  localStream.getVideoTracks().forEach((track) => (track.enabled = true));
  sulfur.start();
};
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
