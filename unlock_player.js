    // 🔑 NEW: Function to handle the unlock logic
    function togglePlayerControls() {
      const block = document.getElementById('clickBlock');
      const unlockBtn = document.getElementById('unlockControlsBtn');
      
      if (isPlayerUnlocked) {
        // Lock the player
        isPlayerUnlocked = false;
        block.classList.remove('unlocked');
        unlockBtn.innerText = "🔒 Unlock Player";
        unlockBtn.style.background = "#FFD700"; // Gold
        alert("Player controls are now locked (undlickable).");
      } else {
        // Prompt for password
        const enteredPass = prompt("Enter password to unlock player controls:");
        
        if (enteredPass === UNLOCK_PASSWORD) {
          // Unlock the player
          isPlayerUnlocked = true;
          block.classList.add('unlocked');
          unlockBtn.innerText = "🔓 Lock Player";
          unlockBtn.style.background = "#35610F"; // Green
          alert("Player controls unlocked! You can now click on the video.");
        } else if (enteredPass !== null) {
          alert("Incorrect password. Controls remain locked.");
        }
        // If enteredPass is null (user clicked cancel), do nothing.
      }
    }
    
    
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        videoId: videos[0].id,
        playerVars: {
          'controls': 0,
          'rel': 0,
          'modestbranding': 1,
          'disablekb': 1,
          'iv_load_policy': 3
        },
        events: { 'onReady': onPlayerReady }
      });
    }
    
    function onPlayerReady() {
      buildPlaylist();
      
      // PlayPause toggle
      document.getElementById('playPauseBtn').onclick = () => {
        if (isPlaying) {
          player.pauseVideo();
          document.getElementById('playPauseBtn').innerText = "▶️";
        } else {
          player.playVideo();
          document.getElementById('playPauseBtn').innerText = "⏸";
        }
        isPlaying = !isPlaying;
      };
      
      // Forward
      document.getElementById('forward').onclick = () => {
        let t = player.getCurrentTime();
        player.seekTo(t + 10, true);
      };
      
      // Backward
      document.getElementById('backward').onclick = () => {
        let t = player.getCurrentTime();
        player.seekTo(t - 10, true);
      };
      
      // Seek bar
      seekBar = document.getElementById('seekBar');
      seekBar.addEventListener('input', () => {
        let percent = seekBar.value;
        let duration = player.getDuration();
        player.seekTo(duration * (percent / 100), true);
      });
      
      updateInterval = setInterval(() => {
        if (player && player.getDuration) {
          let duration = player.getDuration();
          let current = player.getCurrentTime();
          if (duration > 0) {
            seekBar.value = (current / duration) * 100;
          }
        }
      }, 1000);
      
      // Quality Control
      document.getElementById('qualityControl').addEventListener('change', (e) => {
        player.setPlaybackQuality(e.target.value);
      });
      setTimeout(loadQualityLevels, 2000);
      
      
      // ✅ Speed Control
      document.getElementById('speedControl').addEventListener('change', e => {
        player.setPlaybackRate(parseFloat(e.target.value));
      });
      // Fullscreen
      document.getElementById('fullscreenBtn').onclick = () => {
        let container = document.getElementById("videoContainer");
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
        else if (container.msRequestFullscreen) container.msRequestFullscreen();
      };
      
      // 🔑 NEW: Event listener for the unlock button
      document.getElementById('unlockControlsBtn').onclick = togglePlayerControls;
    }
    
    // Quality options लोड करना
    function loadQualityLevels() {
      let levels = player.getAvailableQualityLevels();
      let select = document.getElementById("qualityControl");
      select.innerHTML = "";
      
      levels.forEach(level => {
        let opt = document.createElement("option");
        opt.value = level;
        opt.text = level.toUpperCase();
        select.appendChild(opt);
      });
      
      // Default auto
      if (levels.includes("auto")) {
        select.value = "auto";
        player.setPlaybackQuality("360");
      }
    }
    
    // Playlist बनाना
    function buildPlaylist() {
      const list = document.getElementById("playlist");
      videos.forEach((video, index) => {
        let item = document.createElement("div");
        item.className = "playlist-item" + (index === currentIndex ? " active" : "");
        item.innerText = video.title;
        item.onclick = () => changeVideo(index);
        list.appendChild(item);
      });
    }
    
    // Video बदलना
    function changeVideo(index) {
      if (index < 0 || index >= videos.length) return;
      currentIndex = index;
      player.loadVideoById(videos[index].id);
      
      // active highlight
      document.querySelectorAll(".playlist-item").forEach((el, i) => {
        el.classList.toggle("active", i === currentIndex);
      });
      
      document.getElementById('playPauseBtn').innerText = "⏸";
      isPlaying = true;
    }