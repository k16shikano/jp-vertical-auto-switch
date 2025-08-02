// ポップアップの機能を管理
document.addEventListener('DOMContentLoaded', function() {
    const enableToggle = document.getElementById('enableToggle');
    const refreshBtn = document.getElementById('refreshBtn');
    const resetBtn = document.getElementById('resetBtn');
    const elementCount = document.getElementById('elementCount');
    const changedCount = document.getElementById('changedCount');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    // 設定を読み込み
    chrome.storage.local.get(['enabled', 'elementCount', 'changedCount'], function(result) {
        enableToggle.checked = result.enabled !== false; // デフォルトは有効
        elementCount.textContent = result.elementCount || '0';
        changedCount.textContent = result.changedCount || '0';
        updateStatus(enableToggle.checked);
    });

    // トグル切り替え
    enableToggle.addEventListener('change', function() {
        const enabled = this.checked;
        chrome.storage.local.set({ enabled: enabled });
        updateStatus(enabled);
        
        // アクティブなタブにメッセージを送信
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleEnabled',
                    enabled: enabled
                }).catch(error => {
                    console.log('Content script not ready:', error.message);
                });
            }
        });
    });

    // 統計更新ボタン
    refreshBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'getStats'
                }).then(function(response) {
                    if (response) {
                        elementCount.textContent = response.elementCount || '0';
                        changedCount.textContent = response.changedCount || '0';
                        chrome.storage.local.set({
                            elementCount: response.elementCount,
                            changedCount: response.changedCount
                        });
                    }
                }).catch(error => {
                    console.log('Content script not ready:', error.message);
                    // エラーの場合は保存された統計を表示
                    chrome.storage.local.get(['elementCount', 'changedCount'], function(result) {
                        elementCount.textContent = result.elementCount || '0';
                        changedCount.textContent = result.changedCount || '0';
                    });
                });
            }
        });
    });

    // リセットボタン
    resetBtn.addEventListener('click', function() {
        chrome.storage.local.set({
            elementCount: 0,
            changedCount: 0
        });
        elementCount.textContent = '0';
        changedCount.textContent = '0';
        
        // アクティブなタブにリセットメッセージを送信
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'resetStats'
                }).catch(error => {
                    console.log('Content script not ready:', error.message);
                });
            }
        });
    });

    // ステータス表示を更新
    function updateStatus(enabled) {
        if (enabled) {
            statusDot.classList.add('active');
            statusDot.classList.remove('inactive');
            statusText.textContent = '有効';
        } else {
            statusDot.classList.remove('active');
            statusDot.classList.add('inactive');
            statusText.textContent = '無効';
        }
    }
}); 