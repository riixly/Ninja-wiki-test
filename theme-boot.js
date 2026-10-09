// Apply a saved preference before the stylesheet is parsed.
try {
  if (localStorage.getItem('ninja-theme') === 'akatsuki') {
    document.documentElement.dataset.theme = 'akatsuki';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = '#090506';
  }
} catch {
  // Private browsing and blocked storage default to the blue theme.
}
