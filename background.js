// バックグラウンドスクリプト
chrome.runtime.onInstalled.addListener(function() {
    console.log('JP Vertical Auto-Switch 拡張機能がインストールされました');
    
    // デフォルト設定を初期化
    chrome.storage.local.set({
        enabled: true,
        elementCount: 0,
        changedCount: 0
    });
});

// 拡張機能のアイコンがクリックされたときの処理
chrome.action.onClicked.addListener(function(tab) {
    // ポップアップを表示（manifest.jsonでpopupが設定されている場合は不要）
    console.log('拡張機能アイコンがクリックされました');
});

// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "toggleVertical",
        title: "縦書き切り替えを有効/無効",
        contexts: ["page"]
    });
    
    chrome.contextMenus.create({
        id: "resetStats",
        title: "統計をリセット",
        contexts: ["page"]
    });
});

// コンテキストメニューがクリックされたときの処理
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "toggleVertical") {
        chrome.storage.local.get(['enabled'], function(result) {
            const newEnabled = !result.enabled;
            chrome.storage.local.set({ enabled: newEnabled });
            
            // アクティブなタブにメッセージを送信
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggleEnabled',
                enabled: newEnabled
            }).catch(error => {
                console.log('Content script not ready:', error.message);
            });
        });
    } else if (info.menuItemId === "resetStats") {
        chrome.storage.local.set({
            elementCount: 0,
            changedCount: 0
        });
        
        chrome.tabs.sendMessage(tab.id, {
            action: 'resetStats'
        }).catch(error => {
            console.log('Content script not ready:', error.message);
        });
    }
});

// タブが更新されたときの処理
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        // ページが完全に読み込まれたときにcontent scriptに初期化メッセージを送信
        setTimeout(() => {
            chrome.tabs.sendMessage(tabId, {
                action: 'initialize'
            }).catch(error => {
                // content scriptがまだ読み込まれていない場合は無視
                console.log('Content script not ready yet:', error.message);
            });
        }, 1000);
    }
}); 