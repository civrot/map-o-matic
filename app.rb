require 'rubygems'
require 'em-websocket'
require 'slim'
require 'sinatra/base'
require 'redis'

$channel = EM::Channel.new
SOCKETS = []

Thread.new do
  EventMachine.run do
    class App < Sinatra::Base

      get '/' do
        slim :index
      end
    end

    EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |ws|
      ws.onopen do
        sid = $channel.subscribe { |msg| ws.send msg }
        $channel.push "[-122.926547,45.725029]"
        puts "#{sid} connected"
        puts "creating sockets"
        SOCKETS << ws
      end

      ws.onclose do
        $channel.unsubscribe(sid)
        puts "deleting socket"
        SOCKETS.delete ws
      end
    end

    App.run!({:port => 3000})
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
