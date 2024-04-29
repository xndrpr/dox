# Deex

## WaitMessage
- target: string(@str)
- answer: Message

## Message
- text: string
- wait: boolean(false)
- wait_time(secs): int(0)
- wait_message: WaitMessage?
- wait_time(wait time between sending messages)

## Config
- target: string
    - if contains @ then username, otherwise id
- messages: Message[]

## Plan
- Start
    - Type **message.text**
    - if **wait** Wait for **wait_message.target**
        - When found send **wait_message.answer.text**
        - If **wait** is true wait for **wait_time** seconds