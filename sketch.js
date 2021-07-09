function setup() {
    let myNum = 10;
    let myBool = false;
    storeItem('key1', myNum); // key1 に 10 を保存します  
    storeItem('key2', myBool); // key2 に false を保存します
    print(getItem('key1'));
    print(getItem('key2'));
    clearStorage() ;        // クリアします 
    print(getItem('key1')); // 再度、key1 を取得します -> NULL を表示
    print(getItem('key2')); // 再度、key2 を取得します -> NULL を表示
  }
