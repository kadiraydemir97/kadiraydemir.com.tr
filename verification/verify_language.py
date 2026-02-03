from playwright.sync_api import sync_playwright, expect

def test_language_switch(page):
    page.goto("http://localhost:5173")

    # Wait for page to load
    page.wait_for_selector("text=Activities", timeout=10000)

    # Check default language (EN)
    expect(page.get_by_text("Activities")).to_be_visible()

    # Take screenshot of EN state
    page.screenshot(path="verification/1_en_state.png")

    # Click Language Selector (should be "EN")
    # It might be "en" in DOM but "EN" visually. get_by_text matches content.
    # My test earlier showed it's "en".
    page.get_by_text("en", exact=True).click()

    # Take screenshot of dropdown
    page.screenshot(path="verification/2_dropdown_open.png")

    # Click Turkish
    page.get_by_text("Türkçe").click()

    # Check if language changed
    # "Activities" should become "Etkinlikler"
    expect(page.get_by_text("Etkinlikler")).to_be_visible()

    # Take screenshot of TR state
    page.screenshot(path="verification/3_tr_state.png")

    print("Verification passed!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_language_switch(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
