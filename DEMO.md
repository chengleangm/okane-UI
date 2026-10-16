# OKANE client demo walkthrough

Start with `npm run dev` and open http://localhost:3000.

## Public website

1. Show the homepage, original OKANE logo, Google Sans, service sections, and project CTA.
2. Open **Our Creators**. Try a category filter, search by name, and switch the sort order.
3. Open **Ambrel**, review the profile and sample portfolio, and select **Request work**.
4. Show the clearly labeled Telegram simulation. The optional error preview demonstrates a failed connection and retry.
5. Connect, submit an empty form to demonstrate validation, then complete the required fields.
6. Submit the demo request and review the confirmation. Nothing is transmitted or booked.

## Admin portal

1. Select **Demo portal** in the navigation, or visit http://localhost:3000/portal/login.
2. Select **Fill demo credentials**, demonstrate show/hide password, and sign in.
   - Email: `demo@okane.test`
   - Password: `OkaneDemo123!`
3. Search or filter the creator roster. Open a creator to view their information and content.
4. Choose **Edit creator**, change their details, and save. Close with Cancel, Escape, or the close icon to discard unsaved edits.
5. Return to **All creators** and add a new demo creator. You can choose a profile photo (JPG, PNG, WebP; up to 750 KB).
6. Open the new creator and select **Add content**. Upload an image or short MP4/WebM video under 1.5 MB, give it a title, and save. Videos use normal playback controls.
7. Edit a content title or remove an item. Removal asks for confirmation.
8. Refresh to demonstrate that saved portal changes remain in this browser. Refresh returns to the roster.
9. Use **Reset demo** to restore the original samples, or log out. Logout ends the simulated session in this tab without deleting the saved roster.

## Approval boundary

This is a frontend demonstration. Login is simulated and is not a security boundary. Browser data is not shared between computers or published to the public creator directory. No personal passwords, real booking submissions, Telegram messages, database records, or production uploads are involved.

After design approval, the separate backend stage can provide real authentication, persistent data and media storage, Telegram verification and messaging, and deployment.

Original creator photography, final profile information, and original Figma assets still need to replace the labeled demo content. Browser visual QA is still required before calling the design final.
