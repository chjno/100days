import bs4
import requests
import zipfile
import StringIO
from string import ascii_lowercase


for letter in ascii_lowercase:
    url = 'https://www.freefavicon.com/freefavicons/letters/alpha.php?alpha=' + letter
    html = requests.get(url).text
    soup = bs4.BeautifulSoup(html, "html.parser")
    results = soup.select('li.iconli a')

    dl_page = 'https://www.freefavicon.com/freefavicons/letters/' + results[0].get('href')
    html = requests.get(dl_page).text
    soup = bs4.BeautifulSoup(html, "html.parser")
    zip_file_url = 'https://www.freefavicon.com' + soup.select('a.downloadbutton')[0].get('href').replace('downloadicon', 'download')

    # print zip_file_url
    r = requests.get(zip_file_url, stream=True)
    z = zipfile.ZipFile(StringIO.StringIO(r.content))
    z.extractall()
