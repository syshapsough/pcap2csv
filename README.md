# pcap2csv

##pcap files
At this time, the module converts the traffic in bits/s in both directions.
The module was designed to parse .pcap files acquired using a 'tshark' process that filters traffic based on port number
'''
e.g.  tshark -w myfile.pcap -f "tcp port 1883" -i Ethernet.
'''

##installation
'''
npm install pcap2csv
'''

##sample
A test code is provided in test.js

##to-do
Future updates will make the module more dynamic to offer more parsing options.