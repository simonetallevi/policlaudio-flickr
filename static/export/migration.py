import urllib
import json
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError


class DB(object):
  _user = None
  _password = None
  _host = None
  _db = None
  _engine = None

  def __init__(self, username, password):
    self._password = password
    self._user = username
    self._host = 'localhost'
    self._db = 'photo_claudio'

    self._engine = create_engine(
      'mysql://%s:%s@%s:3306/%s' % (
        self._user, urllib.parse.quote_plus(self._password), self._host, self._db))

  def engine(self):
    return self._engine


def get_json_key(values):
  trim = []
  for value in values:
    if value != '':
      trim.append(value)

  s = '_'.join(trim)
  # s.encode('ascii','ignore').decode("unicode-escape")
  return s


def append(obj, value, type):
  if value != '':
    obj[value] = type


if __name__ == "__main__":

  db = DB('root', '')
  generi = db.engine().execute("""select distinct genere_fotografico from photo""").fetchall()

  results = {'root': {}}
  for genere in generi:
    append(results['root'], genere[0], 'genere_fotografico')
    regni = db.engine().execute("""select distinct regno from photo where genere_fotografico = %s """,
                                [genere[0]]).fetchall()
    genereKey = get_json_key("genere=",[genere[0]])
    results[genereKey] = {}

    for regno in regni:
      append(results[genereKey], regno[0], 'regno')
      phylums = db.engine().execute(
        """select distinct phylum from photo
        where genere_fotografico = %s and regno = %s """,
        [genere[0], regno[0]]).fetchall()
      regnoKey = get_json_key("genere=",[genere[0], "regno=",regno[0]])
      results[regnoKey] = {}

      for phylum in phylums:
        append(results[regnoKey], phylum[0], 'phylum')
        classes = db.engine().execute(
          """select distinct classe from photo
          where genere_fotografico = %s and regno = %s and phylum = %s """,
          [genere[0], regno[0], phylum[0]]).fetchall()
        phylumKey = get_json_key("genere=",[genere[0], regno[0], phylum[0]])
        results[phylumKey] = {}

        for classe in classes:
          append(results[phylumKey], classe[0], 'classe')
          ordini = db.engine().execute(
            """select distinct ordine from photo
            where genere_fotografico = %s and regno = %s
            and phylum = %s and classe = %s """,
            [genere[0], regno[0], phylum[0], classe[0]]).fetchall()
          classeKey = get_json_key("genere=",[genere[0], regno[0], phylum[0], classe[0]])
          results[classeKey] = {}

          for ordine in ordini:
            append(results[classeKey], ordine[0], 'ordine')
            famiglie = db.engine().execute(
              """select distinct famiglia from photo
              where genere_fotografico = %s and regno = %s
              and phylum = %s and classe = %s and ordine = %s """,
              [genere[0], regno[0], phylum[0], classe[0], ordine[0]]).fetchall()
            ordineKey = get_json_key("genere=",[genere[0], regno[0], phylum[0], classe[0], ordine[0]])
            results[ordineKey] = {}

            for famiglia in famiglie:
              append(results[ordineKey], famiglia[0], 'famiglia')
              specie = db.engine().execute("""select distinct specie from photo
                where genere_fotografico = %s and regno = %s
                and phylum = %s and classe = %s and ordine = %s and famiglia = %s """,
                                           [genere[0], regno[0], phylum[0], classe[0], ordine[0],
                                            famiglia[0]]).fetchall()
              famigliaKey = get_json_key("genere=",[genere[0], regno[0], phylum[0], classe[0], ordine[0], famiglia[0]])
              results[famigliaKey] = {}

              for s in specie:
                append(results[famigliaKey], s[0], 'specie')
                nomi = db.engine().execute("""select distinct nome_comune from photo
                where genere_fotografico = %s and regno = %s and phylum = %s
                and classe = %s and ordine = %s and famiglia = %s and specie = %s """,
                                           [genere[0], regno[0], phylum[0], classe[0], ordine[0], famiglia[0],
                                            s[0]]).fetchall()
                specieKey = get_json_key("genere=",[genere[0], regno[0], phylum[0], classe[0], ordine[0], famiglia[0], s[0]])
                results[specieKey] = {}
                for nome in nomi:
                  append(results[specieKey], nome[0], 'nome comune')

  trimmedResults = {}
  for key in results:
    if len(results[key]) > 0:
      trimmedResults[key] = results[key]

  with open('data.json', 'w') as outfile:
    json.dump(trimmedResults, outfile)
