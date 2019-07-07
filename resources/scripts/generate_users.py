from argparse import ArgumentParser
import requests
import json

parser = ArgumentParser()
parser.add_argument("-f", "--from",   dest="range_from", help="starting range", type=int)
parser.add_argument("-t", "--to",     dest="range_to",   help="ending range",   type=int)
parser.add_argument("-p", "--prefix", dest="prefix",     help="user prefix",    type=str)
parser.add_argument("-u", "--url",    dest="url",        help="manager url",    type=str)
args = parser.parse_args()


for i in range(args.range_from, args.range_to):
    payload = {'username': "{}{}".format(args.prefix,i),
               'email'   : "{}{}@harena.ds4h.org".format(args.prefix,i),
               'password': "{}{}".format(args.prefix,i)}
    response = requests.request('POST', args.url, data = payload)
    print(response.text)
