/********************
 * GLOBAL CONSTANTS *
 ********************/
const MOBILE_BREAKPOINT = 768;

/***********
 * LANDING *
 ***********/
/**
 * Initiates process of redirecting to home page.
 */
function goHome()
{
  // Set z-index of black background to 999 so it goes over logo and button.
  document.querySelector("div.blackBackground").style.zIndex = "999";
  // Fade in black background to prepare for smooth page redirect.
  document.querySelector("div.blackBackground").style.animation = "fadeIn 0.75s linear forwards";
  // Redirect to the home page a little after fade in animation is complete.
  setTimeout(function() {
    window.location.href = "home.html";
  }, 1000);
}

/************************
 * UNIVERSAL ANIMATIONS *
 ************************/
/* Universal Animation Constants */
const SVG_ANIMATION                        = "drawSVG";
const SLIDE_VERTICAL_ANIMATION_TRANSLATE   = "slideVerticalTranslate";
const SLIDE_HORIZONTAL_ANIMATION_LEFT      = "slideHorizontalLeft";
const SLIDE_HORIZONTAL_ANIMATION_TRANSLATE = "slideHorizontalTranslate";
const SLIDE_RIGHT_ANIMATION                = "slideRight";
const FADE_IN_ANIMATION                    = "fadeIn";
const FADE_OUT_ANIMATION                   = "fadeOut";
/**
 * Applies the Slide Up and Fade In Animation Sequence.
 *
 * @param params Defines which element to apply animation to and how.
 *               params[x].elementID: element's ID,
 *               params[x].duration: animation's duration.
 *               params[x].delay: animation's delay.
 */
function animateSlideUpFadeIn(params)
{
  // Loop through all passed in elements to be animated.
  for (var i = 0; i < params.length; i++)
  {
    // Apply slide up and fade in animations to given element with its specified parameters.
    document.getElementById(params[i].elementID).style.animation =
        SLIDE_VERTICAL_ANIMATION_TRANSLATE + " " + params[i].duration + " ease-out " + params[i].delay + " forwards, " +
        FADE_IN_ANIMATION + " " + params[i].duration + " linear " + params[i].delay + " forwards";
  }
}
/**
 * Scrolls Page to Specified Element Smoothly.
 *
 * @param target Defines which element to smoothly scroll to (".x or #x")
 * @param duration Time it should take to complete scroll animation (in milliseconds).
 */
function smoothScrollTo(target, duration)
{
  // Calculate position of target element relative to top of page taking into account
  // nav bar height and dead space.
  var navBarHeight = document.querySelector("nav").offsetHeight;
  var elementHeight = document.querySelector(target).offsetHeight;
  var windowHeight = window.innerHeight;
  // Dead space is between the nav bar & top of element and between bottom of
  // element & bottom of browser.
  var deadSpace = windowHeight - (navBarHeight + elementHeight);
  // Shape offset is target element's portion of the white separating line.
  var shapeOffset = document.querySelector(target).offsetHeight * 0.03;
  // Desktop Version: Subtract half of dead space and nav bar height to set target position with the element in the middle of the screen.
  // Mobile Version: Subtract shape offset and nav bar height to set target position just before target's content.
  var targetPos = window.innerWidth > MOBILE_BREAKPOINT 
                ? document.querySelector(target).offsetTop - (deadSpace/2 + navBarHeight)
                : document.querySelector(target).offsetTop - (navBarHeight - shapeOffset);
  
  // Position of scroll bar when animation begins.
  var startPos = window.pageYOffset;

  // Distance between start and end position.
  var distance = targetPos - startPos;

  var startTime = null;

  /**
   * Nested function used to control smooth scroll animation.
   *
   * @param currentTime Passed in from requestAnimationFrame(); defines the amount of
   *    time current page has been opened for (in milliseconds).
   */
  function scroll(currentTime)
  {
    if (startTime == null)
    {
      // If startTime has not been initialized, set as current time.

      startTime = currentTime;
    }
    // Define how long animation has been running for.
    var timeElapsed = currentTime - startTime;
    // Scroll to next position calculated by getNextPose() function.
    window.scrollTo(0, getNextPose(timeElapsed, startPos, distance, duration));
    
    if (timeElapsed < duration)
    {
      // If animation's time elapsed has not exceeded defined duration of animation,
      // initialize next frame of animation.

      requestAnimationFrame(scroll);
    }
  }

  /**
   * Nested function used to get position of next frame for smooth scroll animation.
   *
   * @param t Time elapsed of animation.
   * @param b Scroll offset from top when animation is first initialized.
   * @param x Distance between start and end position of animation.
   * @param d Duration of animation.
   *
   * @return Position of next frame for animation.
   */
  function getNextPose(t, b, x, d)
  {
    // Quadratic easing in/out formula.
    t /= d/2;
    if (t < 1)
    {
      return x/2*t*t + b;
    }
    t--;
    return -x/2 * (t*(t-2) - 1) + b;
  }

  // Initialize first frame of animation.
  requestAnimationFrame(scroll);
}

/**
 * Scrolls page to a specified element on load.
 *
 * @param element Class of element to scroll to on page load.
 */
function scrollOnLoad(element)
{
  // Verify element is not null.
  if (element != null)
  {
    // Element exists, scroll to it.

    smoothScrollTo("." + element, 1500);
  }
}

/**
 * Controls When Elements Are Displayed With Slide Up and Fade In Animation Based on Scroll Position.
 *
 * @param targetElementID ID of element used to calculate initPosition.
 * @param elementIDs IDs of elements to slide up and fade in when initPosition is met.
 */
function initScrolledSlideUpFadeIn(targetElementID, elementIDs)
{
  // Init position is the halfway point of the target element calculated by
  // adding half height of target element and the distance between bottom of first
  // section and top of target element.
  var initPosition = document.getElementById(targetElementID).offsetHeight/2 +
      (document.getElementById(targetElementID).offsetTop - window.innerHeight);

  // Get current opacity of first element in array to tell if elements have already been initialized.
  var element = document.getElementById(elementIDs[0]);
  var currentOpacity = window.getComputedStyle(element).getPropertyValue("opacity");

  if (window.scrollY >= initPosition && currentOpacity == 0)
  {
    // If page is scrolled to initialize point and elements have not yet been initialized
    // (based on whether or not current opacity of first element is still 0.0), apply slide up and
    // fade in animation to elements.

    // Declare parameters array to later be filled with all elementIDs and animation parameters.
    var parameters = [];

    // Loop through all elementIDs and add them to parameters array with added parameters.
    for (var i = 0; i < elementIDs.length; i++)
    {
      // Create temporary array with all animation parameters for element.
      var temp = {elementID:elementIDs[i],duration:"1s",delay:(i*0.15) + "s"};
      // Append to parameters array.
      parameters.push(temp);
    }

    // Animate elements to slide up and fade in.
    animateSlideUpFadeIn(parameters);
  }
}

/*****************
 * URL ATTRIBUTE *
 *****************/
/**
 * Gets value of a specified URL attribute.
 *
 * @param attribute URL attribute to get value of.
 *
 * @return value of attribute.
 */
function getURLAttribute(passedAttribute)
{
  // Get full URL to later be searched.
  var url = document.URL;
  // Define variable that will control when to look for "?" or "&", attribute, and value.
  // 0: "?" or "&", 1: attribute, 2: value
  var stage = 0;
  // Declare URL attribute and value to later be filled.
  var attribute = "", value = "";

  // Loop through all characters looking for "?" (where attributes start).
  for (var i = 0; i <= url.length; i++)
  {
    if (url.charAt(i) == "?" || url.charAt(i) == "&" || i == url.length)
    {
      if (stage == 0)
      {
        // Found "?" or "&" so start recording attribute until "="

        stage = 1;
      } else
      {
        // End of attribute value, check if attribute matches passed in attribute.

        if (attribute == passedAttribute)
        {
          // Attribute is the one being looked for, return value of attribute.

          return value;
        } else
        {
          // Attribute is not the one being looked for, reset for next attribute.

          attribute = "";
          value = "";
          stage = 1;
        }
      }
    } else if (url.charAt(i) == "=")
    {
      // Attribute recording is complete, now record value.

      stage = 2;
    } else if (stage == 1)
    {
      attribute += url.charAt(i);
    } else if (stage == 2)
    {
      value += url.charAt(i);
    }
  }

  // Attribute could not be found, return false.
  return null;
}

/*********
 * VIDEO *
 *********/
/**
 * Plays all videos within same parent element of play button.
 *
 * @param playButtonNode Play button element which will be used to access video siblings.
 */
function playVideos(playButtonNode)
{
  // Get parent node, aka container of video siblings to playButtonNode.
  var parent = playButtonNode.parentNode;
  // Get all children, should contain videos.
  var children = parent.childNodes;

  // Loop through all children and load & play video elements.
  for (var i = 0; i < children.length; i++)
  {
    // Look for first video element, play the rest after the video file has loaded.
    // Note: If trying to play all videos at once, without preloading, an exception is generated.
    if (children[i].tagName == "VIDEO")
    {
      // Listener handler for playing all videos after the initial video file is loaded.
      function playVids()
      {
        // Disable and fade out play button.
        playButtonNode.style.pointerEvents = "none";
        playButtonNode.style.animation = "fadeOut 0.5s linear forwards";

        // Find and play all other video elements.
        for (var j = i+1; j < children.length; j++)
        {
          if (children[j].tagName == "VIDEO")
          {
            children[j].play();
          }
        }
      }
      // Listener handler for showing the play button again and removing event listeners.
      function endVids(event)
      {
        // Fade in play button.
        playButtonNode.style.pointerEvents = "auto";
        playButtonNode.style.animation = "fadeInPlayButton 0.5s linear forwards";

        // Remove event listeners.
        event.target.removeEventListener("canplay", playVids);
        event.target.removeEventListener("ended", endVids);
      }

      // Begin loading/playing video that all video elements will display.
      // Note: load() causes a cancelled video file download while play() does not.
      children[i].play();
      // Event listeners for when ready to play and when to end videos (ie show play button and remove listeners).
      children[i].addEventListener("canplay", playVids);
      children[i].addEventListener("ended", endVids);

      // Initialized all videos with first video element, so stop the loop.
      break;
    }
  }
}

/******************
 * NAVIGATION BAR *
 ******************/
/**
 * Navigation Bar Constants
 */
const NAV_BACKGROUND_COLOR = "#4E4E4E";
/**
 * Set Background Color of Navigation Bar
 */
function changeNavBackgroundColor()
{
  if (window.scrollY != 0 || window.innerWidth <= MOBILE_BREAKPOINT)
  {
    // If scroll value is not zero (page is scrolled), add background color.
    // Also, do not change background to transparent for mobile navigation bar.

    document.querySelector("nav").style.backgroundColor = NAV_BACKGROUND_COLOR;
  } else
  {
    // Page is not scrolled, make background color transparent.

    document.querySelector("nav").style.backgroundColor = "transparent";
  }
}
/**
 * Toggle Collapse on Mobile Navigation Bar
 */
function toggleNav()
{
  var animation, icon;
  // Get navigation bar collapse status via times/bars symbol.
  var isCollapsed = document.querySelector("nav #logoContainer i.fas").classList.value.includes("times");
  if (isCollapsed) {
    // Set navigation bar retract values.

    animation = "retractNav";
    icon = "bars";
  } else
  {
    // Set navigation bar collapse values.

    animation = "collapseNav";
    icon = "times";
  }

  // Initiate collapse/retract animation and symbol change.
  var navNode = document.querySelector("nav");
  document.querySelector("nav").style.animation = "0.25s " + animation + " ease-out forwards";
  navNode.querySelector("#logoContainer i.fas").classList = "fas fa-" + icon;
}

/*************
 * COPYRIGHT *
 *************/
/**
 * Gets Current Year and Sets Copyright Year in Footer
 */
function setCopyrightYear()
{
  var d = new Date();
  document.getElementById("currentYear").innerHTML = d.getFullYear();
}

/************
 * INCLUDES *
 ************/
/**
 * Includes Navigation Bar
 */
function includeNavBar()
{
  // Pages array controls which page link in nav bar is highlighted (given
  // "active" class) based on which page the user is on.
  var pages = [{page:"home",status:""},{page:"about",status:""},{page:"contact",status:""},
      {page:"projects",status:""},{page:"experiences",status:""},{page:"awards",status:""}];
  // Loop through pages array to find which matches current page.
  for (var i = 0; i < pages.length; i++)
  {
    if (pages[i].page == document.body.id)
    {
      // If page name in array matches current page (id of body tag),
      // change status of array element to "active."
      // This will essentially set the class of the page link to "active."

      pages[i].status = "active";
    }
  }

  // Append navigation bar code to "nav" element.
  document.querySelector("nav").innerHTML = `
    <!-- Nav links left group -->
    <ul>
      <!-- Links -->
      <li><a class="` + pages[0].status + `" href="home.html">Home</a></li>
      <li><a class="` + pages[1].status + `" href="about.html">About</a></li>
      <li><a class="` + pages[2].status + `" href="contact.html">Contact</a></li>
    </ul>
    <!-- Nav logo middle link -->
    <ul id="logoContainer">
      <!-- Logo/Text link -->
      <li><a href="home.html"><div></div></a></li>
      <!-- Mobile Text -->
      <li><h1>Jovan<br><span>Yoshioka</span></h1></li>
      <!-- Mobile Collapse Button -->
      <li><a onclick="toggleNav()"><i class="fas fa-bars"></i></a></li>
    </ul>
    <!-- Nav links right group -->
    <ul>
      <!-- Links -->
      <li><a class="` + pages[3].status + `" href="projects.html">Projects</a></li>
      <li><a class="` + pages[4].status + `" href="experiences.html">Experiences</a></li>
      <li><a class="` + pages[5].status + `" href="awards.html">Awards</a></li>
    </ul>
  `;

  // Create and append spacer after "nav" element.
  // Prevents content from being behind mobile navigation bar (due to "position:fixed").
  var spacerNode = document.createElement("DIV");
  spacerNode.classList.add("navSpacer");
  document.querySelector("nav").insertAdjacentElement("afterend", spacerNode);
}
/**
 * Includes Footer
 */
function includeFooter()
{
  // Append navigation bar code to "footer" element.
  document.querySelector("footer").innerHTML = `
    <!-- Social media icon links -->
    <a href="https://www.linkedin.com/in/jovanyoshioka/" target="_blank" class="socialMediaIcon fab fa-linkedin-in"></a>
    <a href="https://www.github.com/jovanyoshioka" target="_blank" class="socialMediaIcon fab fa-github"></a>
    <!-- Horizontal line divider -->
    <div></div>
    <!-- Copyright statement -->
    <!-- Note: Must register with USPTO to use copyright symbol -->
    <small>Copyright <span id="currentYear">2024</span> by Jovan Yoshioka. All Rights Reserved.</small>
    <small>Created by Jovan Yoshioka</small>
  `;
}
/**
 * loads Modular (Included) Content
 */
function includeContent()
{
  // Call various include functions that append HTML modular content to parent elements.
  includeNavBar();
  includeFooter();
}

/*************
 * SLIDESHOW *
 *************/
/**
 * Slideshow Constants
 */
const SLIDESHOW_IMG_CLASS      = "slideshowImages";
const SLIDESHOW_BTN_CLASS      = "slideshowSelectors";
const SLIDESHOW_INTERVAL       = 4000;
const SLIDESHOW_FIRST_INTERVAL = SLIDESHOW_INTERVAL-2000;
const SLIDESHOW_TIMEOUT        = 6000;
/**
 * Allows first slide to switch faster than others due to delay on page load.
 */
var slideshowInitializing;
/**
 * Slideshow Interval/Timeout Variables
 */
var slideshowIterator;
var slideshowTimeout;
/**
 * Gets Index of Slideshow Currently Shown
 */
function getSlideshowShownIndex()
{
  // Get total number of slideshow images.
  var numOfImages = document.getElementsByClassName(SLIDESHOW_IMG_CLASS).length;

  // Cycle through slides and find currently shown index.
  for (var i = 0; i < numOfImages; i++)
  {
    if (document.getElementsByClassName(SLIDESHOW_IMG_CLASS)[i].style.opacity == 1)
    {
      // If slideshow image is visible, return the index, "i."
      return i;
    }
  }

  // Could not find any slide that was shown, return default 0.
  return 0;
}
/**
 * Changes Slideshow's Title and Time Text with Slide/Fade Animations.
 *
 * @param isInitialize Used to decide if text should be set (first function call)
 *    or changed with animation (any other call).
 * @param delay Delays text change animation (milliseconds).
 * @param elementID ID of title/time text element to be manipulated.
 * @param newText Title/time that the passed in element should be set/changed to.
 */
function changeSlideshowText(isInitialize, delay, elementID, newText)
{
  // Declare and initialize variable to hold repeatedly used DOM element.
  var element = document.getElementById(elementID);

  if (isInitialize == false)
  {
    // If function call is not for initializing slideshow, change text with sliding/fading animation.

    // setTimeout using potential passed in delay (in milliseconds).
    setTimeout(function() {
      const ANIMATION_DURATION = 0.5;

      // Animate text element to slide to the right and fade out (as if it were leaving).
      element.style.animation = SLIDE_RIGHT_ANIMATION + " " + ANIMATION_DURATION + "s ease-in forwards, " +
                                FADE_OUT_ANIMATION + " " + ANIMATION_DURATION + "s ease-in forwards";
      // setTimeout used to wait for previous animation to be complete before proceeding.
      // Text element must be invisible before changing text and moving element
      // to the left for re-entry.
      setTimeout(function() {
        // Move text to the left for re-entry.
        element.style.left = "-5vw";
        // Change text to new title/time.
        element.innerHTML = newText;
        // Animate text element to slide to the right from the left and fade in
        // (as if it were entering).
        element.style.animation = SLIDE_HORIZONTAL_ANIMATION_LEFT + " " + ANIMATION_DURATION + "s ease-in forwards, " +
                                  FADE_IN_ANIMATION + " " + ANIMATION_DURATION + "s ease-out forwards";
      }, ANIMATION_DURATION*1000);
    }, delay);
  } else
  {
    // Function call is for initializing slideshow, so just set title text.

    element.innerHTML = newText;
  }
}
/**
 * Update Additional Content: Blurred Background, Title Text, Time Text, Button Destination.
 * (Optional Feature)
 *
 * @param showIndex Index of slide to base updates on.
 */
function updateSlideshowContent(showIndex, isInit)
{
  // Declare and initialize variable to hold slideshow image element for repeated future use.
  var imgElement = document.getElementsByClassName(SLIDESHOW_IMG_CLASS)[showIndex];

  // Get imgElement's section attribute to determine if should update and to get
  // content section parent element later.
  var section = imgElement.getAttribute("section");

  if (section != null)
  {
    // If slideshow image has section attribute (and therefore should have all
    // additional content containers), update additional content to match current slide.

    // Get content section parent element.
    var parent = document.querySelector(section);

    // Change blurredBackground image to that of imgElement's src.
    document.getElementById("blurredBackground").style.backgroundImage = "url('" + imgElement.currentSrc + "')";

    // Update title text to image's custom "title" attribute.
    changeSlideshowText(isInit, 0, "slideshowTitle", parent.querySelector("h1").innerHTML);

    // Update subtitle text to image's custom "subtitle" attribute.
    changeSlideshowText(isInit, 75, "slideshowSubtitle", parent.querySelector("h2").innerHTML);

    // Update time text to image's custom "time" attribute.
    changeSlideshowText(isInit, 125, "slideshowTime", parent.querySelector("h3").innerHTML);

    if (isInit == true)
    {
      // If function call is for initializing, show "Learn more" slide button.

      document.getElementById("slideshowBtn").style.visibility = "visible";
    }
    // Update button's destination to image's custom "dest" attribute.
    document.getElementById("slideshowAnchor").setAttribute("onclick","smoothScrollTo('" + section + "', 1500);");
  }
}
/**
 * Switch Slide
 *
 * @param showIndex Index of slide to show.
 * @param hideIndex Index of slide to hide.
 */
function switchSlideshowSlide(showIndex, hideIndex)
{
  // Hide currently shown image, show selected image.
  document.getElementsByClassName(SLIDESHOW_IMG_CLASS)[showIndex].style.opacity = 1.0;
  document.getElementsByClassName(SLIDESHOW_IMG_CLASS)[hideIndex].style.opacity = 0.0;

  // Update additional slide content if present (optional feature).
  updateSlideshowContent(showIndex, false);

  // Change which slideshow button is selected by darkening color of selected button in order.
  document.getElementsByClassName(SLIDESHOW_BTN_CLASS)[showIndex].className += " active";
  document.getElementsByClassName(SLIDESHOW_BTN_CLASS)[hideIndex].className = SLIDESHOW_BTN_CLASS;
}
/**
 * Determines if Okay to Switch Slides Based on if Any Current Slideshow Animations in Progress
 * 
 * @return true if okay to switch, false if not okay.
 */
function isReadyToSwitch()
{
  // Use title and time offset to verify no animation is starting/ending.
  // Note: title is first element to move in animation, and time is last.
  // If no title and time elements are present, aka only images present, allow rapid switching.
  var titleNode = document.getElementById("slideshowTitle");
  var timeNode = document.getElementById("slideshowTime");

  if ((titleNode && timeNode) && (titleNode.offsetLeft == 0 && timeNode.offsetLeft == 0))
  {
    // Title and time elements exist, animation is complete, return true.

    return true;
  } else if (titleNode && timeNode)
  {
    // Title and time elements exist, but animations are not complete, return false.

    return false;
  } else
  {
    // Only images are present, so return true regardless; rapid image transitions looks okay.
    
    return true;
  }
}
/**
 * Selects Slideshow Image
 *
 * @param index Index of slide user selected to view using slideshow selectors.
 */
function selectSlideshowImg(index)
{
  // If slideshow is not currently switching, switch slides.
  if (isReadyToSwitch() == true)
  {
    // Stop iterator so slideshow does not switch immediately.
    clearInterval(slideshowIterator);
    // Stop previous restarter timeout.
    clearTimeout(slideshowTimeout);

    // Get shown image index and initialize variable, "index."
    var shownIndex = getSlideshowShownIndex();

    if (shownIndex != index)
    {
      // If slide selected is not already shown, switch slides.
      // Otherwise, do nothing.

      switchSlideshowSlide(index, shownIndex);
    }

    slideshowTimeout = setTimeout(function(){
      // Begin iterating through slideshow images.
      slideshowIterator = setInterval(runSlideshow, SLIDESHOW_INTERVAL);
    }, SLIDESHOW_TIMEOUT);
  }
}
/**
 * Changes Slideshow to Previous Slide.
 */
function selectPreviousSlide()
{
  // If slideshow is not currently switching, switch slides.
  if (isReadyToSwitch() == true)
  {
    // Get index of currently shown slide.
    var currentSlide = getSlideshowShownIndex();

    if (currentSlide == 0)
    {
      // Currently shown slide is the first, so switch to last slide.

      var slideCount = document.getElementsByClassName(SLIDESHOW_IMG_CLASS).length;
      selectSlideshowImg(slideCount-1);
    } else
    {
      // If slide index is between 1 and "n", switch to slide with index-1.

      selectSlideshowImg(currentSlide-1);
    }
  }
}
/**
 * Changes Slideshow to Next Slide.
 */
function selectNextSlide()
{
  // If slideshow is not currently switching, switch slides.
  if (isReadyToSwitch() == true)
  {
    // Get index of currently shown slide.
    var currentSlide = getSlideshowShownIndex();

    var slideCount = document.getElementsByClassName(SLIDESHOW_IMG_CLASS).length;
    if (currentSlide == slideCount-1)
    {
      // Currently shown slide is the last, so switch to first slide.

      selectSlideshowImg(0);
    } else
    {
      // If slide index is between 0 and "n-1", switch to slide with index+1.

      selectSlideshowImg(currentSlide+1);
    }
  }
}
/**
 * Controls Showing/Hiding of Slideshow Images
 */
function runSlideshow()
{
  if (slideshowInitializing == true)
  {
    // If slideshow iteration is for the first slide, change interval timeout.
    clearInterval(slideshowIterator);
    slideshowIterator = setInterval(runSlideshow, SLIDESHOW_INTERVAL);
    slideshowInitializing = false;
  }

  // Get total number of slideshow images.
  var numOfImages = document.getElementsByClassName(SLIDESHOW_IMG_CLASS).length;

  // Get shown image index and initialize variable, "index."
  var index = getSlideshowShownIndex();

  // Switch to the next image in order.
  if (index != numOfImages-1)
  {
    // If image is visible and not last in order, switch to the next image.

    switchSlideshowSlide(index+1, index);
  } else if (index == numOfImages-1)
  {
    // If image is visible and last in order, switch to the first image in order.

    switchSlideshowSlide(0, index);
  }
}
/**
 * Creates slideshow selectors' elements based on number of slides/images.
 * By having slideshow selectors automatically created, reduces amount of
 * code required to create slideshow and therefore minimizes risk of error.
 *
 * @param slideCount Defines how many slide selectors to create.
 */
function createSlideSelectors(slideCount)
{
  // Repeat the element creation process "slideCount" times.
  for (var i = 0; i < slideCount; i++)
  {
    // Create button element.
    var node = document.createElement("BUTTON");
    // Add "slideshowSelectors" class to button.
    node.classList.add(SLIDESHOW_BTN_CLASS);
    if (i == 0)
    {
      // If element is first slideshow selector, add default "active" class.

      node.classList.add("active");
    }
    // Set onclick action to select corresponding slide.
    node.setAttribute("onclick","selectSlideshowImg(" + i + ")");
    // Append button element node to slideshow selectors container.
    document.querySelector(".selectorsContainer").appendChild(node);
  }
}
/**
 * Initialize Slideshow Images and Slideshow Iteration
 */
function initSlideshow()
{
  // Store image objects in variable.
  var images = document.getElementsByClassName(SLIDESHOW_IMG_CLASS);

  // Get total number of slideshow images.
  var numOfImages = images.length;

  // Create slideshow selectors' elements.
  createSlideSelectors(numOfImages);

  // Show first slideshow image without opacity transition duration.
  images[0].style.transition = "none";
  images[0].style.opacity = 1.0;
  // Reapply transition duration for future slide changes.
  // Without setTimeout, opacity previously set will be run with the transition.
  setTimeout(function() {
    images[0].style.transition = "opacity 1s";
  }, 0);

  // Set slideshow images' opacity to style DOM element later.
  for (var i = 1; i < numOfImages; i++)
  {
    images[i].style.opacity = 0.0;
  }

  // Set additional slide content if present (optional feature).
  updateSlideshowContent(0, true);

  // Begin iterating through slideshow images.
  // First slide takes longer to switch on page load, so switch faster than normal.
  slideshowInitializing = true;
  slideshowIterator = setInterval(runSlideshow, SLIDESHOW_FIRST_INTERVAL);
}
/**
 * Change Parent Height to Smallest Slideshow Image Height for Mobile Sizing
 * Note: Using Slideshow Image With Smallest Height Because Prevents Whitespace From Smaller Images if Based on Largest Height.
 *       Instead, Larger Images Will be Cut Off Which is Better Than Having Whitespace.
 */
function resizeSlideshow()
{
  // Resize based on images' height only for mobile, i.e. if equal/below MOBILE_BREAKPOINT.
  if (window.innerWidth <= MOBILE_BREAKPOINT)
  {
    // Is mobile version, so get smallest image height and set slideshow parent to it.

    var slideshowImages = document.getElementsByClassName("slideshowImages");
    // By default, smallest image height will be first image's height.
    var slideshowImgHeight = slideshowImages[0].offsetHeight;
    // Loop through slideshow images and determine smallest image height.
    for (var i = 0; i < slideshowImages.length; i++)
    {
      if (slideshowImages[i].offsetHeight < slideshowImgHeight)
      {
        // Current slideshow image is smaller than recorded smallest image height, so replace recorded with current.
        slideshowImgHeight = slideshowImages[i].offsetHeight;
      }
    }
    // Set slideshow parent height to smallest image height.
    document.querySelector(".slideshow").style.height = slideshowImgHeight + "px";
  } else
  {
    // Is desktop version, so set slideshow parent height to "100vh".
    document.querySelector(".slideshow").style.height = "100vh";
  }
}

/*******************
 * LATEST ACTIVITY *
 *******************/
/**
 * Applies SVG Animation to SVG Paths
 */
function animatePathsLatestActivity()
{
  // Loop through all path elements to apply the animation.
  for (var i = 0; i < document.getElementsByTagName("path").length; i++)
  {
    // Set animation value to SVG animation.
    document.getElementsByTagName("path")[i].style.animation = SVG_ANIMATION + " 2.75s linear forwards";
  }
}
/**
 * Applies Animations to Header Elements
 */
function animateHeaderLatestActivity()
{
  // Animate header outer and inner shape to slide right into view.
  document.getElementById("headerOuterShape").style.animation = SLIDE_HORIZONTAL_ANIMATION_LEFT + " 1s ease-out forwards";
  document.getElementById("headerInnerShape").style.animation = SLIDE_HORIZONTAL_ANIMATION_LEFT + " 1s ease-out 0.15s forwards";
  // Declare and initialize element's parameters for animating text.
  var parameters = [{elementID:"headerText",duration:"0.5s",delay:"1.15s"}];
  // Animate header text to slide up and fade in.
  animateSlideUpFadeIn(parameters);
}
/**
 * Controls When Latest Activity is Displayed Based on Scroll Position
 */
function initLatestActivity()
{
  // Init position is the 2/3 point of latestActivitySection element taking into account nav bar height.
  var initPosition = document.getElementById("latestActivitySection").offsetTop -
      (document.querySelector("nav").offsetHeight + document.getElementById("latestActivitySection").offsetHeight*(3/5));
  // Get current animation of first, and therefore all, path elements.
  var currentPathAnimation = document.getElementsByTagName("path")[0].style.animation;

  if (window.scrollY >= initPosition && !(currentPathAnimation.includes(SVG_ANIMATION)))
  {
    // If page is scrolled to initialize point and initialization has not already
    // been done (detected by if SVG animation has already been applied), then
    // initialize latest activity content.

    // Animate all SVG paths to draw latest activity image.
    animatePathsLatestActivity();

    // Animate header slide and fade in.
    animateHeaderLatestActivity();

    // Declare and initialize elements' parameters for animating article.
    var parameters = [{elementID:"latestActivityTitle",duration:"1s",delay:"1.15s"},
                      {elementID:"latestActivityBody",duration:"1s",delay:"1.4s"},
                      {elementID:"latestActivityBtn",duration:"1s",delay:"1.65s"}];
    // Animate article elements to slide up and fade in.
    animateSlideUpFadeIn(parameters);
  }
}

/**********
 * LEVELS *
 **********/
/* Levels Constants */
const NUM_OF_LEVELS = 5;
/**
 * Creates a levels' container and creates/appends level elements.
 *
 * @param activeCount Defines number of levels that should get "active" class.
 * @return Levels' container node that will later be appended to parent row.
 */
function createLevels(activeCount)
{
  // Declare level node for later repeated use.
  var levelNode = null;

  // Create levels' container element node.
  var containerNode = document.createElement("TD");
  // Apply levelsContainer class to container node.
  containerNode.classList.add("levelsContainer");

  // Create five level elements and append to container; only make certain
  // number of levels active based on "numOfLevels" variable.
  for (var j = 0; j < NUM_OF_LEVELS; j++)
  {
    // Create level "div" element node.
    levelNode = document.createElement("DIV");

    if (j+1 <= activeCount)
    {
      // If number of active levels has not been met, apply "active" class.

      levelNode.classList.add("activeLevel");
    }

    // Append newly created level element to levels' parent container.
    containerNode.appendChild(levelNode);
  }

  // Return container node that holds all level elements.
  return containerNode;
}
/**
 * Appends Levels' Elements to Parent Container; Reduces Clutter in HTML File.
 */
function fillLevels() //<td class="levelsContainer" levels="5"></td>
{
  // Create variable holding all skill/level rows.
  var rows = document.getElementsByTagName("tr");
  // Declare variables for later repeated use.
  var numOfActive = null, levels = null;

  // Loop through all rows and append levels' containers and level elements.
  for (var i = 0; i < rows.length; i++)
  {
    // Get and store number of levels from row's levels attribute.
    numOfActive = rows[i].getAttribute("levels");

    if (numOfActive != null)
    {
      // If row element has levels attribute, continue with appending process.

      // Create elements and store in levels variable to later be appended to row.
      levels = createLevels(numOfActive);
      // Append levels to row parent.
      rows[i].appendChild(levels);
    }
  }
}
/**
 * Displays levels using activateLevel animation.
 */
function displayLevels()
{
  // Loop through the "NUM_OF_LEVELS" levels and activate them one by one for each row.
  for (var i = 0; i < NUM_OF_LEVELS; i++)
  {
    // Get levels in column "i" of languages table.
    var levels = document.querySelectorAll("div.activeLevel:nth-of-type(" + (i+1) + ")");

    // Loop through all levels and activate each by applying activeLevel animation.
    for (var j = 0; j < levels.length; j++)
    {
      // Apply animation with delay based on column number ("i").
      levels[j].style.animation = "activateLevel 0.75s linear " + (0.4*i) + "s forwards";
    }
  }
}

/**********
 * SKILLS *
 **********/
/**
 * Displays tools using SLIDE_HORIZONTAL_ANIMATION_TRANSLATE and FADE_IN animation.
 */
function displayTools()
{
  // Get all elements with the "tool" class.
  var tools = document.getElementsByClassName("tool");

  // Loop through all tools applying animations to each.
  for (var i = 0; i < tools.length; i++)
  {
    // Apply animation with delay based on tool's row number.
    tools[i].style.animation = SLIDE_HORIZONTAL_ANIMATION_TRANSLATE + " 1s ease-out " + (0.15*i) + "s forwards," +
                               FADE_IN_ANIMATION + " 0.75s linear " + (0.25 + (0.15*i)) + "s forwards";
  }
}
/**
 * Controls When Skills Section Elements Are Displayed Based on Scroll Position.
 **/
function initSkills()
{
  // Init position is the halfway point of skillsSection element calculated by
  // adding half height of target element and the distance between bottom of first
  // section and top of target element.
  var initPosition = document.getElementById("skillsSection").offsetHeight/2 +
      (document.getElementById("skillsSection").offsetTop - window.innerHeight);

  // Get current opacity of first tool element to tell if elements have already been initialized.
  var element = document.getElementsByClassName("tool")[0];
  var currentOpacity = window.getComputedStyle(element).getPropertyValue("opacity");

  if (window.scrollY >= initPosition && currentOpacity == 0)
  {
    // If page is scrolled to initialize point and elements have not yet been initialized
    // (based on whether or not current opacity of first element is still 0.0), apply display animations
    // to levels and tools elements.

    displayLevels();
    displayTools();
  }
}

/**************************
 * CONTACT MAIN CONTAINER *
 **************************/
/**
 * Resizes Contact Page's Main Container to Fit Height of Screen Taking Into Consideration the Navigation Bar Height.
 */
function resizeContactContainer()
{
  if (window.innerWidth <= MOBILE_BREAKPOINT && window.innerHeight > window.innerWidth)
  {
    // If mobile version and portrait orientation, proceed to set.

    // Set main container's height to window's height minus navigation bar's height.
    var navHeight = document.querySelector("nav").offsetHeight;
    document.querySelector("main").style.height = (window.innerHeight-navHeight) + "px";
  } else
  {
    // If not mobile version, set main container's height back to "100vh".

    document.querySelector("main").style.height = "100vh";
  }
}

/***********************
 * PROJECTS THUMBNAILS *
 ***********************/
/**
 * Sets Projects Videos' Thumbnails With Supported Format (.webp vs .jpg)
 */
function setProjectsThumbnails()
{
  // Contains list of projects sections and corresponding thumbnails.
  const SECTIONS_THUMBNAILS = [
    {section:"hopfieldDrone", thumbnail:"jovi_hopfield_drone"},
    {section:"portfolio", thumbnail:"portfolio_thumbnail"},
    {section:"alienX", thumbnail:"alienX_thumbnail"},
    {section:"assassinPlugin", thumbnail:"assassin_plugin_cover"},
    {section:"pathFollowing", thumbnail:"pathFollowing_thumbnail"},
    {section:"e-ssue", thumbnail:"e-ssue_cover"}
  ];
  // Path to projects' video thumbnails.
  const PROJECTS_ASSETS_PATH = "../assets/projects/";

  // Get image file extension (.webp vs .jpg) based on already-loaded image.
  // Note: this is necessary because some browsers do not support .webp extension.
  var str = document.querySelector("." + SECTIONS_THUMBNAILS[0].section + " img").currentSrc;
  var ext = str.substring(str.length-4, str.length);

  // Loop through all sections, get video nodes, and set their "poster" source (aka thumbnail).
  var videosNodes;
  for (var i = 0; i < SECTIONS_THUMBNAILS.length; i++)
  {
    videosNodes = document.querySelectorAll("." + SECTIONS_THUMBNAILS[i].section + " video");
    for (var j = 0; j < videosNodes.length; j++)
    {
      videosNodes[j].poster = PROJECTS_ASSETS_PATH + SECTIONS_THUMBNAILS[i].thumbnail + "." + ext;
    }
  }
}