require 'rubygems'
require 'em-websocket'
require 'redis'

$channel = EM::Channel.new
SOCKETS = []

Thread.new do
  EventMachine.run do
    EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |ws|
      ws.onopen do
        puts "creating sockets"
        $channel.subscribe { |msg| ws.send msg }
        SOCKETS << ws
      end

      ws.onclose do
        puts "deleting socket"
        $channel.unsubscribe(sid)
        SOCKETS.delete ws
      end
    end
  end
end

Thread.new do
  redis = Redis.new
  redis.subscribe('mapdata') do |on|
    on.message do |channel, msg|
      puts "##{channel} -> #{msg}"
      $channel.push msg
    end
  end
end

sleep
