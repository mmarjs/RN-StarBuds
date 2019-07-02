### Release notes: ios 1.0(11)

  #Completed Features/Bugs Resolved
  1. 'Log in' button text in Login page has been fixed('Lon in' is replaced with 'Log in')
  2. Fixed username icon and added Header with back button in ForgotPassword page
  3. Added black background for user's images in Profile page
  4. Added code to open video urls(links are treated as url not local video)
  5. Updated tabbar font style in AddPost tab(Font style modification implies to all subviews)
  6. Add new profile picture feature has been finished in Profile page.
  5. Updated settings and share icon in Profile page(Share icon has been updated in Home page, Saved Photos page when there are no posts)
  6. Updated saved photos page design when there are no saved photos
  7. Updated Home and Profile page design when there are no posts
  8. Fixed navigation issue in Profile page(When we were navigating from Profile page to Findbuds/TaggedPhoto/SavedPhoto and vice-versa, there was jerk in Profile page. This issue has been fixed)
  9. Updated Home page design(Fixed the bottom icons and text. Added swiper when there are multiple images)
  10. Click photo and video button has been merged into one button (one simple press it will take photo and on long press it will start recording video) in Photo tab of Add New Post page
  11. Added default focus of keyboard in AddCaption page
    
  #Uncompleted Features/Bugs
  1. Image caching
  2. Covert PhotTags and TagPeople page to Modal

### Release notes: ios 1.0(12)
  1. Made image border color black in Gallery View of Add New Post page

### Release notes: ios 1.0(16)
1. Fixed images not showing in their original size in Home feed(When there are multiple images, images are shown with same size inside the swiper)
2. Removed muliple loading indicators from Profile page
3. Showed all the saved photos of user in SavedPhotos' all tab with pagination
4. Added logic to show compressed videos with their thumbnail in homepage feed(Need api changes) to loads thumbnail faster)
5. Added logic to like, dislike, save and unsave a post in PostDetail page(which opens when clicking any image in Profile page and pages inside it)
5. Added inline croping and multiple image selection in gallery page
6. Fix Video recording progress bar design

###Known bugs for ios 1.0(16)
1. Slow loading of video thumbnail and video itself
2. Video thumbnail not shown in NewPost page
3. In Gallery page design is not proper
4. While selecting image from gallery there is jerk


### Release notes: ios 1.0(17)
1. Added multiple image cropping in Gallery page
2. Fixed scrolling issue in Gallery page
3. Updated design of Listview in Profile page(Now the list looks like Home page feed)
4. Added option to open a post in a Post page to view the post details in Profile page
5. Added feature to comment on Post from Home page feed, Postdetails page and Listview in Profile page
6. Added comment page which shows all comments and also allows to comment on a post
7. Updated design of Home page feed and PostDetails page according to the new Feed Structure design
8. Updated design of Buds, Featured and Group screens
9. Implemented Featured screen(It shows users of starbuds and allows user to follow and unfollow other users)
10. Showed video thumbnails in Homepage, Profile(grid, list, saved, photos of user) screens
11. Fixed images not showing placeholder in Profile(grid, list, saved, photos of user)

###Known bugs for ios 1.0(17)
1. No of comments not updated in Homepage feed and List view in Profile after adding a comment
2. Video and camera squre capture issue

### Release notes: ios 1.0(19)
1. Fixed Video and thubmnai loading issue
2. Media upload to s3 has been shifted to backend side.

### Release notes: ios 1.0(21)
1. Changed the address type in Home page feed and Comments page
2. Updated code to save selected location in New Post
3. Removed No Comments text from Home feed and PostDetails when there are no comments
4. Updated design of Follow/Following button
5. Fixed design of All Saved photos and Create Groups for iphone 5/5s
6. Fixed loading indicator alignment for posts in Profile page
7. Fixed background color of Home page feed when there are no posts in Feed
8. Used CachedImage in whole app where user's profile picture is used
9. Updated left icon in Home page feed
10. Fixed the button designs for Login/Signup with facebook, Connect to facebook, FollowFacebookFriends etc
11. Made FallbackImage defaultUser image for ProfilePicture and defaultPlaceholder for other images
12. Fixed image cropping in Gallery page
13. Fixed issue of images not loading in Gallery when app is opened first time

### Release notes: ios 1.0(22)
1. Removed post and comment time 0seconds and used 'now' instead
2. Got facebook friends frm facebook in Buds screen
3. Fixed picker to choose gender not working in android
4. Removed underline from AddCaption input in android
5. Design fixes in following pages: Signup, SignupWithFacebook, AddCaptionModal, AddLocationModal, AddComment, ConfirmEmail, Contacts Fixed header alignment for header in android(It must be centered)
6. Updated styles for all header texts and images(now app uses same spacing for texts and images in header left and right)
7. Updated followers count in Profile page when a user is followed from buds and featured
8. Removed loader while doing follow and unfollow user from Contacts and DiscoverBuddies
9. Showed the post created time as following(If time difference is in year, post will show x years ago and so on for month, day, hour, min) 
10. Added logic to update profile picture in AddProfilePicture page and Profile page
11. Updated logo of AddFacebookFriend
12. Fixed design of results from google places search in AddLocation modal and google-places-auto-complete library for android
13. Made NewPost page a modal
14. Fixed scrolling issue in Gallery page

### Release notes: ios 1.0(23)

### Release notes: ios 1.0(24)
1. Enabled push notifications for like post, comment on post, user is tagged in post and chat
2. Fixed the palcement of video icon in Home page feed, Profile > ListView and PostDetails
3. Added Following screens
 i. Recent Chats
 ii. Chat Messages
 iii. Add Chat
 iv. Share Post
 v. Other User's Profile(On tap of username in Home page feed and Profile > ListView, that user's profile will be opened)
4. Share Post from Home page feed and Profile>ListView to Users in Chat
5. Notification count for unread Chats in Home Page
6. Navigation to User Profile from Home Page Feed
7. Open NewPost on tap of Share and Plus icon from Home and Profile

Known bugs:
1. Image/Video Swiper dots position in Home page feed, Profile > ListView and PostDetails

### Release notes: ios 1.0(26)
1. Video and Image cropping fixed in IOS
2. Navigation to User Profile From All screen on name tap.
3. Chat UI bugs and logic issues


### Release notes: ios 1.0(31)
1. Bug fixes
2. Added activity module
3. Progress bar enhancement while post upload.
4. Fixed network connectivity issue.
5. Change activity indicator in all pages.
6. Change all static images(png to jpg) and also compress it

### Release notes: ios 1.0(32)
1. Bug fixes
2. Added activity module
3. Progress bar enhancement while post upload.
4. Fixed network connectivity issue.
5. Change activity indicator in all pages.
6. Change all static images(png to jpg) and also compress it
7. Fixed camera crashing issue.


### Release notes: ios 1.0(36)
1. Fixed issues in Deep linking to Post Id via sharing URL/Facebook. 
2. Fixed issues  User can't report their own post!
3. Fixed pull to refresh crashing app in Profile page
4. Fixed loading indicators not displaying on Loading page
5. Fixed image rotation issue in camera page
6. Fixed app crash when user add his photo after signup 
7. Fixed bugs are mark as "To be tested" on zoho


### Find bugs on  : ios  1.0(37)
1. Home -> Tag people not displaying accordingly to image index.
2. Facebook sign up -> Birthdate filed background color is not proper ( http://prntscr.com/i18jlj).
3. Sign up -> Add profile pic -> camera permission deny -> shoude be re-ask or show message camera/  gallery permission is deny.
4. NEW post -> set limitaion of chose photo from gallery ( ios).
5. New post -> near by location text design is not proper ( http://prntscr.com/i18nmr ).
6. Add comment -> aligment is not proper (http://prntscr.com/i18plw),
7. Capture photo from camera -> redirect to new post -> same time Activity indicater.
8. Profile page -> not showing all post ( 1. http://prntscr.com/i18rlt 2. http://prntscr.com/i18sjf).
9. In chatting page -> showing 2 activity indicator.

## Release note

 
*  Verify -> When I post an image with a tagged person it won't show up in my profile. 
*  Verify -> When you open to start a new chat it won't let you do anything from that screen. It freezes
*  Verify -> Profile photo doesn't show up in the bottom navigation
*  Fixed -> Tag user on photo - Close button should be moved to the right edge
*  Changed video icon in posting screen.
*  Changed tab icon
