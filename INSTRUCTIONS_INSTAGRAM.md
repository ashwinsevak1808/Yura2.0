# How to Display Your Instagram Feed on Yuraa

To show your actual Instagram posts on the website, you need to connect your Facebook/Instagram account to the Meta Developer Platform and generate an **Access Token**.

> **Note:** You do NOT need a separate "Yuraa" Facebook account. You can use your personal Facebook account (`Ashwin Sevak`) to manage the "Yuraa" Page and App. This is the standard way (Business Pages are always owned by personal accounts).

## Step 1: Prepare Your Social Accounts

1.  **Switch to Professional Account**: On your **Yuraa** Instagram app, go to Settings > Account Type and switch to **Business** or **Creator** account (if not already).
2.  **Create a Facebook Page**:
    *   Log in to Facebook with your personal account.
    *   Create a text Page named **"Yuraa"** (or similar).
    *   **Connect Instagram to Facebook Page**: Go to the Page's "Settings" > "Linked Accounts" > "Instagram" and connect your Yuraa Instagram account.

## Step 2: Create a Meta App

1.  Go to [developers.facebook.com](https://developers.facebook.com/).
2.  Log in with your personal Facebook account.
3.  Click **"My Apps"** > **"Create App"**.
4.  Select **"Other"** > **Next**.
5.  Select **"Business"** (or "Consumer" if Business isn't available) > **Next**.
6.  Enter App Name: `Yuraa Web Feed`.
7.  Enter your contact email.
8.  Click **Create App**.

## Step 3: Add Instagram Support

1.  In your new App Dashboard, scroll to find **"Instagram Graph API"** (NOT "Basic Display" - that is deprecated).
2.  Click **"Set Up"**.
3.  Scroll to the **"Tools"** > **"Graph API Explorer"** section or look for "User Token Generator" if available.

*(Easier Method: Using the Graph API Explorer)*
1.  Go to [Tools -> Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2.  **Select your App** in the "Meta App" dropdown.
3.  **Permissions**: Add the following permissions in the "Add a Permission" dropdown:
    *   `instagram_basic`
    *   `pages_show_list`
    *   `business_management` (sometimes needed)
    *   `pages_read_engagement`
4.  Click **"Generate Access Token"**.
5.  A popup will appear. Login and select your **Yuraa Facebook Page** and **Yuraa Instagram Account**.
6.  Click **Allow/Save**.

## Step 4: Get The Long-Lived Token (Important)

The token you just generated only lasts 1 hour. You need a "Long-Lived" token (60 days).

1.  Copy the token from the Access Token field.
2.  Click the **"i" (Info)** icon next to the token field.
3.  Click **"Open in Access Token Tool"**.
4.  Click **"Extend Access Token"** (blue button).
5.  Copy this **New Long Token**.

## Step 5: Configure Website

1.  Open your project code.
2.  Create/Edit the `.env.local` file.
3.  Add the token:
    ```env
    INSTAGRAM_ACCESS_TOKEN=YOUR_LONG_TOKEN_HERE
    ```
4.  Restart your server (`npm run dev`).

The website will now automatically fetch and display your latest Instagram posts instead of the placeholders.
