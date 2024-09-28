// --- Login Functionality ---

const loginPassword = "celebrateFailure";  // The correct password to log into the computer
const wrongPasswords = ["three", "apple", "money", "aGoodUpbringing", "manyskillz", "AscTechInnoCohort", "Smartness", "success", "sharkbon2024", "rasul", "college", "willpower"];
const realPassword = "failure";
const hints = [
    "Hmm... try: 2+1",
    "That's weird, try: a common red fruit.",
    "Huh. Try: money",
    "Weird, try: aGoodUpbringing",
    "Seriously? Try: manyskillz",
    "Bruh. Try: AscTechInnoCohort",
    "Ugh... try: Smartness",
    "What? Try: success",
    "Uh... try: sharkbon2024",
    "I see... try: rasul",
    "Try: college",
    "I don't know... try: willpower",
    'Hmm... type something with a "@" in it.',
    'Hmm... type something with a number in it.'
];
let currentIndex = 0;
let currentPassword = "";
let attempts = 0;
var endAudio = new Audio('end.mp3')

// Wait for the document to be ready
$(document).ready(function() {
    // Initially hide the desktop and game window
    $(".desktop").hide();
    $("#gameWindow").hide();
    $("#creditsOverlay").hide();
    $("#signOut").hide();

    // Handle login to desktop
    $("#loginBtn").on("click", function() {
        const password = $("#passwordInput").val();
        if (password === loginPassword) {
            $("#passwordInput").hide();
            $("#loginBtn").hide();
            $("#forgotBtn").hide();
            $("#loginError").text("Signing in...");
            $("#load").show();

            setTimeout(function(){
                $("#loginScreen").fadeOut('fast', function() {
                    $(".desktop").fadeIn('fast');
                    $("#top").text("Desktop");
                });
            }, 4500);
        } else {
            if (password === "failure") {
                $("#loginError").text("Not here, try this somewhere else...");
            }
            else {
                $("#loginError").text("Incorrect password, please try again.");
            }
        }
    });

    $("#forgotBtn").on("click", function() {
        $("#loginError").text(`Your password is ${loginPassword}, don't forget it.`);
    });

    // --- Desktop Functionality ---

    // Toggle Start Menu
    $("#startButton").on('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        $("#startMenu").toggle();
    });

    // Close Start Menu when clicking outside
    $(document).on('click', function(e) {
        if (!$("#startMenu").is(e.target) && $("#startMenu").has(e.target).length === 0 &&
            !$("#startButton").is(e.target) && $("#startButton").has(e.target).length === 0) {
            $("#startMenu").hide();
        }
    });

    // Handle Game Icon Click to Open Game Window
    $("#gameIcon").on('dblclick', function() {
        openWindow('gameWindow', 'icon.jpeg', 'Secret to Success');
    });
    $("#myComputer").on('dblclick', function() {
        openWindow('pcWindow', 'pc.png', 'My Computer');
    });

    // Alternatively, handle single click
    // $("#gameIcon").on('click', function() {
    //     openWindow('gameWindow', 'https://img.icons8.com/windows/32/000000/application-window.png', 'Secret to Success');
    // });

    // Function to Open a Window and Add to Taskbar
    function openWindow(windowId, iconSrc, windowName) {
        const win = $("#" + windowId);
        if (win.is(":visible")) {
            win.fadeOut();
            toggleTaskbarIcon(windowId, false);
        } else {
            win.fadeIn();
            win.css('z-index', getNextZIndex());
            addToTaskbar(windowName, iconSrc, windowId);
        }
    }

    // Add Window to Taskbar
    function addToTaskbar(name, iconSrc, windowId) {
        // Check if already in taskbar
        if ($(`#taskbar-icon-${windowId}`).length > 0) return;

        const icon = $(`<div class="taskbar-icon" id="taskbar-icon-${windowId}"><img src="${iconSrc}" alt="${name}" title="${name}"></div>`);
        $("#taskbarIcons").append(icon);

        icon.on('click', function() {
            toggleWindowVisibility(windowId);
        });
    }

    // Toggle Window Visibility from Taskbar
    function toggleWindowVisibility(windowId) {
        const win = $("#" + windowId);
        if (win.is(":visible")) {
            win.fadeOut();
        } else {
            win.fadeIn();
            win.css('z-index', getNextZIndex());
        }
    }

    // Get the next highest z-index for window stacking
    function getNextZIndex() {
        let maxZ = 100;
        $(".window").each(function() {
            const z = parseInt($(this).css('z-index')) || 100;
            if (z > maxZ) maxZ = z;
        });
        return maxZ + 1;
    }

    // Handle Minimize and Close Functions
    window.minimizeWindow = function(windowId) {
        $("#" + windowId).fadeOut();
    }

    window.closeWindow = function(windowId) {
        $("#" + windowId).hide();
        $(`#taskbar-icon-${windowId}`).remove();
    }

    // --- Make Windows Draggable and Resizable using Interact.js ---

    interact('.window')
        .draggable({
            allowFrom: '.window-header',
            listeners: {
                move (event) {
                    const target = event.target;
                    // Keep the dragged position in the data-x/data-y attributes
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    // Translate the element
                    target.style.transform = `translate(${x}px, ${y}px)`;

                    // Update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move (event) {
                    const target = event.target;
                    let x = parseFloat(target.getAttribute('data-x')) || 0;
                    let y = parseFloat(target.getAttribute('data-y')) || 0;

                    // Update the element's style
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';

                    // Translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    target.style.transform = `translate(${x}px, ${y}px)`;

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: { width: 300, height: 200 }
                })
            ],
            inertia: true
        });

    // --- Game Functionality ---

    // Handle game password submissions
    $("#submitBtn").on("click", function() {
        const userInput = $("#passwordInputGame").val();

        if (attempts < 35) {
            if (attempts === 0) {
                if (userInput === realPassword) {
                    playedAlready();
                } else {
                    if (userInput) {
                        addHint();
                        attempts++;
                    }
                }
            }
            else {
                if ((wrongPasswords.length - 1) - currentIndex === -1) {
                    let check = /@/;
                    if (check.test(userInput)) {
                        addHint();
                        attempts++;
                    }
                }
                else if ((wrongPasswords.length - 1) - currentIndex === -2) {
                    if (hasNumber(userInput)) {
                        addHint();
                        attempts++;
                    }
                }
                else {
                    if (userInput === currentPassword) {
                        addHint();
                        attempts++;
                    }
                }
            }
        } else {
            $("#hintContainer").html(`<p>The correct password is: ${realPassword}</p>`);
        }

        $("#passwordInputGame").val('');  // Clear input after every attempt
        if (userInput === realPassword && attempts > 0) {
            showSuccess();
        }
    });

    function addHint() {
        currentIndex = Math.floor(Math.random() * hints.length);
        const randomHint = hints[currentIndex];
        if ($("#hint").length > 0) {
            $("#hint").text(`${randomHint}`);
        }
        else {
            const newHint = $(`<p id='hint'>${randomHint}</p>`);
            $("#hintContainer").append(newHint);
        }
        if (currentIndex <= wrongPasswords.length -1) {
            currentPassword = wrongPasswords[currentIndex];
        }
    }

    function showSuccess() {
        $("#hintContainer").fadeOut('fast');
        $("#passwordInputGame").fadeOut('fast'); 
        $("#submitBtn").fadeOut('fast'); 
        $("#showBtn").fadeOut('fast'); 
        $("#successMessage").text("The secret to success is");
        $("#successMessage").fadeIn('slow', 'swing', function(){
            setTimeout(function(){
                $("#successMessage").text("The secret to success is.");
                setTimeout(function(){
                    $("#successMessage").text("The secret to success is..");
                    setTimeout(function(){
                        $("#successMessage").text("The secret to success is...");
                        setTimeout(function(){
                            $("#successMessage").text("The secret to success is: Failure");
                            $(".desktop").css({background: "url('true.jpg') no-repeat center center fixed"})
                            $(".desktop").css({backgroundSize: "cover"})
                            endAudio.play()
                            $("#top").text("The Secret To Success: Failure");
                            $("#gameTitle").text("The Secret To Success: Failure");
                        }, 3500);
                    }, 6500);
                }, 3500);
            }, 3500);
        });
    }

    $("#showCredits").on("click", function(e) {
        e.preventDefault();
        $("#creditsOverlay").fadeIn('fast');
    });

    $("#closeCredits").on("click", function() {
        $("#creditsOverlay").fadeOut('fast');
    });

    function playedAlready() {
        $("#hintContainer").fadeOut('fast');
        $("#passwordInputGame").fadeOut('fast'); 
        $("#submitBtn").fadeOut('fast'); 
        $("#showBtn").fadeOut('fast'); 
        $("#successMessage").text("You played this already, so you must know that the true answer to success is: Failure.");
        $("#successMessage").fadeIn('slow');
        $(".desktop").css({background: "url('true.jpg') no-repeat center center fixed"})
        $(".desktop").css({backgroundSize: "cover"})
        endAudio.play()
        $("#top").text("The Secret To Success: Failure");
        $("#gameTitle").text("The Secret To Success: Failure");
    }

    function hasNumber(myString) {
        return /\d/.test(myString);
    }

    $("#showBtn").on("click", function() {
        let pass = $("#passwordInputGame");
        if (pass.attr("type") === "password") {
            pass.attr("type", "text");
        }
        else {
            pass.attr("type", "password");
        }
    });

    $("#logOut").on("click", function() {
        $("#signOut").fadeIn();
        $(".desktop").fadeOut();
        $("#gameWindow").fadeOut();
        $("#creditsOverlay").fadeOut();
        setTimeout(function(){
            $("#loginScreen").fadeIn('fast')
            $("#passwordInput").show();
            $("#loginBtn").show();
            $("#forgotBtn").show();
            $("#loginError").text("");
            $("#load").hide();
            $("#signOut").fadeOut();
            $("#passwordInput").val("")
        }, 5000)
    })

});