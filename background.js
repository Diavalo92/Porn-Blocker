const allowedSites = [
  "github.com",
  "github.io",
  "githubusercontent.com"
];

const blockedSites = [
  "rule34.xxx",
  "pornhub.com",
  "xvideos.com",
  "xhamster.com",
  "xnxx.com",
  "redtube.com",
  "youporn.com",
  "spankbang.com",
  "tube8.com",
  "beeg.com",
  "porntube.com",
  "hentaihaven",
  "nhentai.net",
  "e-hentai.org",
  "exhentai.org",
  "hentai2read.com",
  "hentaifox.com",
  "hentaihere.com",
  "hentaipulse.com",
  "simply-hentai.com",
  "pururin.io",
  "asmhentai.com",
  "tsumino.com",
  "doujins.com",
  "doujin-moe.us",
  "hitomi.la",
  "9hentai.to",
  "hentai-id.tv",
  "hentai.tv",
  "hentai-studio.com",
  "hentai-stream",
  "hentaistream.tv",
  "hentaiplay.net",
  "hentai-proxy.com",
  "hanime.tv",
  "hanime1",
  "hentai-moon",
  "hentai-streaming",
  "hentaiwatch",
  "hentaiworld",
  "hentaiworldwide"
];

const blockedKeywords = [
  "nsfw",
  "porn",
  "xxx",
  "hentai",
  "rule34",
  "nude",
  "sex",
  "porno",
  "xhamster",
  "xnxx",
  "redtube",
  "youporn",
  "spankbang",
  "tube8",
  "beeg",
  "porntube",
  "hanime"
];

const SAFESEARCH_RULES = [
  {
    id: 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: [
              { key: "safe", value: "active" }
            ]
          }
        }
      }
    },
    condition: {
      regexFilter: "^https?://(www\\.)?google\\.([a-z]{2,3}|[a-z]{2}\\.[a-z]{2})/search",
      resourceTypes: ["main_frame", "sub_frame"]
    }
  },
  {
    id: 2,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: [
              { key: "adlt", value: "strict" }
            ]
          }
        }
      }
    },
    condition: {
      regexFilter: "^https?://(www\\.)?bing\\.([a-z]{2,3}|[a-z]{2}\\.[a-z]{2})/search",
      resourceTypes: ["main_frame", "sub_frame"]
    }
  },
  {
    id: 3,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: [
              { key: "kp", value: "1" }
            ]
          }
        }
      }
    },
    condition: {
      regexFilter: "^https?://(www\\.)?duckduckgo\\.([a-z]{2,3}|[a-z]{2}\\.[a-z]{2})/",
      resourceTypes: ["main_frame", "sub_frame"]
    }
  }
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3],
    addRules: SAFESEARCH_RULES
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkAndCloseTab(tabId, changeInfo.url);
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url) {
    checkAndCloseTab(tab.id, tab.url);
  }
});

function checkAndCloseTab(tabId, url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const searchQuery = urlObj.search.toLowerCase();
    const fullUrl = url.toLowerCase();
    
    const isAllowed = allowedSites.some(site => hostname.includes(site));
    if (isAllowed) return;
    
    const siteBlocked = blockedSites.some(site => hostname.includes(site));
    const keywordBlocked = blockedKeywords.some(keyword => 
      fullUrl.includes(keyword) || searchQuery.includes(keyword)
    );
    
    if (siteBlocked || keywordBlocked) {
      chrome.tabs.remove(tabId);
    }
  } catch (e) {
  }
}
