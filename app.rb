require 'rubygems'
require 'em-websocket'
require 'yajl'
require 'slim'
require 'sinatra/base'
require 'thin'
require 'redis'

$channel = EM::Channel.new

EventMachine.run do
  class App < Sinatra::Base

    get '/' do
      slim :index
    end

    post '/' do
      $channel.push "POST>: #{params[:text]}"
    end
  end

  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |ws|
    ws.onopen do
      sid = $channel.subscribe { |msg| ws.send msg }
      $channel.push "[-122.926547,45.725029]"
      puts "#{sid} connected"

      #redis = Redis.new(:timeout => 0)
      #redis.subscribe('mapdata') do |on|
        #on.message do |channel, msg|
          #data = JSON.parse(msg)
          #puts "##{channel} -> #{msg}"
          #$channel.push msg
        #end
      #end

      ws.onmessage do |msg|
        puts "received <#{sid}> #{msg}"
        $channel.push "<#{sid}>: #{msg}"
      end 

      ws.onclose do 
        $channel.unsubscribe(sid)
      end 
    end 

  end

  App.run!({:port => 3000})
end
