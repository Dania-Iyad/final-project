<h1 class="hero-text" id="typewriter"></h1>

<script>
  const text = "Welcome";
  const target = document.getElementById("typewriter");
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(typeLetter, 150); // سرعة الكتابة
    }
  }

  typeLetter();
</script>
