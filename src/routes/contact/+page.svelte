
<form action="mailto:foo@example.com" method="get" enctype="text/plain">
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" placeholder="your@email.com" required><br><br>
  
    <label for="subject">Subject:</label><br>
    <input type="text" id="subject" name="subject" placeholder="Subject" required><br><br>
  
    <label for="body">Message:</label><br>
    <textarea id="body" name="body" placeholder="Your Message" rows="5" required></textarea><br><br>
  
    <button type="submit">Send</button>
  </form>