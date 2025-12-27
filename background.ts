
/**
 * ZenFlow Background Engine
 */

declare const chrome: any;

const AD_DOMAINS = [
  "doubleclick.net",
  "googleadservices.com",
  "googlesyndication.com",
  "moatads.com",
  "adnxs.com",
  "serving-sys.com",
  "adform.net"
];

// Helper to update blocking rules
async function updateBlockingRules() {
  const storage = await chrome.storage.local.get(['blockedSites', 'adBlockEnabled']);
  const sites = storage.blockedSites || [];
  const adBlockEnabled = storage.adBlockEnabled || false;

  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);

  let newRules: any[] = [];
  
  // 1. DISTRACTION BLOCKING (High Priority)
  sites.forEach((site, index) => {
    newRules.push({
      id: index + 1,
      priority: 2,
      action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
      condition: { 
        urlFilter: `*://*.${site}/*`, 
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] 
      }
    });
  });

  // 2. AD SUPPRESSION (Lower Priority)
  if (adBlockEnabled) {
    AD_DOMAINS.forEach((domain, index) => {
      newRules.push({
        id: 1000 + index,
        priority: 1,
        action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
        condition: { 
          urlFilter: `*://*.${domain}/*`, 
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.IMAGE,
            chrome.declarativeNetRequest.ResourceType.SCRIPT,
            chrome.declarativeNetRequest.ResourceType.SUB_FRAME
          ] 
        }
      });
    });
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && (changes.blockedSites || changes.adBlockEnabled)) {
    updateBlockingRules();
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  updateBlockingRules();
});
