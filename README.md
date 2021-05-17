# Opticall

The purpose of this small Nodejs app is to network enable the Luxafor Flag (https://luxafor.com/flag-usb-busylight-availability-indicator/). The purpose is to convert it's use from a "busy" indicator to a "call" indicator. This is in a production context where you are trying to gain the attention of other parties on an intercom system so they will pick up the intercom and listen in.

## Network capability

It supports two network mechanisms for communication: TCP (HTTP REST) and UDP.

TCP allows for direct calls, allows for direct point-to-point calls. You can still do group calls with this but that requires knowing all the endpoints and then making several calls to each member of the group.

UDP gives the advantages of not having to know the group composition, each member of a group decides which group they are a part of. The disadvantage of UDP is potential for lost messages, particularly in overloaded networks (https://en.wikipedia.org/wiki/User_Datagram_Protocol#Reliability_and_congestion_control_solutions).

These are enabled/disabled via configuration.

## Configuration

The config file should live in a file in the location config\default.json


### File Format

```javascript
{
    "Intercom": {
    },
    "UDP": {
    },
    "TCP": {
    }
}
```

### Intercom configuration
```javascript
{
    "Intercom": {
        "channel": "Audio", // Group membership name
        "solo": "Phil" // Individual name
    }
}
```

### UDP Configuration
```javascript
{
    "UDP": {
        "enabled": true, // Switch the UDP service on/off
        "port": 7000, // What port to bind to
        "bindingAddress": "192.168.1.241" // Which IP to bind to
    }
}
```

### TCP Configuration
```javascript
{
    "TCP": {
        "enabled": false, // Switch the TCP service on/off
        "port": 3000 // 
    }
}
```



