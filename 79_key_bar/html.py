import os
from string import ascii_lowercase


for letter in ascii_lowercase:
    filename = 'favicons/' + letter + '.html'
    html = '''<html>
    <head>
      <link rel="icon" href="%s.png" type="image/png">
    </head>
    </html>''' % letter

    f = open(filename, 'w')
    f.write(html)
    f.close()
