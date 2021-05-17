# Opticall

The purpose of this small Nodejs app is to network enable the Luxafor Flag (https://luxafor.com/flag-usb-busylight-availability-indicator/). The purpose is to convert it's use from a "busy" indicator to a "call" indicator. This is in a production context where you are trying to gain the attention of other parties on an intercom system so they will pick up the intercom and listen in.

## Network capability

It supports two network mechanisms for communication: TCP (HTTP REST) and UDP.

TCP allows for direct calls, allows for direct point-to-point calls. You can still do group calls with this but that requires knowing all the endpoints and then making several calls to each member of the group.

UDP gives the advantages of not having to know the group composition, each member of a group decides which group they are a part of. The disadvantage of UDP is potential for lost messages, particularly in overloaded networks (https://en.wikipedia.org/wiki/User_Datagram_Protocol#Reliability_and_congestion_control_solutions).

These are enabled/disabled via configuration.

## Configuration

The config file should live in a file in the location 'config\default.json'


### File Format

```javascript
{
    "Notify": {
        ...
    },
    "UDP": {
        ...
    },
    "TCP": {
        ...
    }
}
```

### Notify configuration
```javascript
{
    "Notify": {
        "group": "Group Name", // Group membership name
        "solo": "Specific Solo Name" // Individual name
    }
}
```

This is where the parameters of 

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

## Invoking the server

### TCP Endpoint

http://ip:port/message

### Command object

Both the REST and UDP endpoints receive the same message format (in the body for the REST call).

```javascript
{ 
    "command": "flash", 
    "target": "Audio", 
    "group": "#FFF933", 
    "solo": "#FF5733" }

```

### Commands

There are 3 commands:
* **flash** - Flash the light, it will flash up to 255 times
* **on** - Turns the light on
* **off** - Turn the light off/stop flashing

### Target

The target is either the group name or a specific participant.

### Colors

These colours should be any HTML Hex value (https://www.w3schools.com/colors/colors_picker.asp)

* **group** - The colour to use for a group notification
* **solo** - The colour to use for a solo notification