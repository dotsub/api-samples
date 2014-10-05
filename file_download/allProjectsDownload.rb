=begin

A example of the project, media and download API using Ruby. This script downloads all published captions in all project for the logged in user as SRT files.
Please update the values with your username and password before running.

Note: This requires the extended API.

=end
require 'net/http'
require 'json'

$dotsub_username = 'your_dotsub_username'
$dotsub_password = 'your_dotsub_password'

def execute_http_request(url)
  uri = URI(url)
  req = Net::HTTP::Get.new(uri)
  req.basic_auth $dotsub_username, $dotsub_password
  res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') { |http|
    http.request(req)
  }
end

def execute_api_request(url)
  res = execute_http_request(url)
  JSON.parse(res.body)
end

def download_file(url)
  res = execute_http_request(url)
  filename = res.get_fields('Content-Disposition')[0].gsub('attachment;filename=', '')
  File.write(filename, res.body)
end

projects = execute_api_request("http://dotsub.com/api/project")
projects['projects'].each do |p|
  #paging parameters
  limit = 20
  offset = 0
  total_results = 0
  puts "Downloading from Project #{p['title']}"
  begin
    #fetch 20 videos at a time from the project API
    puts "Fetching videos #{offset} to #{offset + limit} of #{total_results}"
    project_media = execute_api_request("https://dotsub.com/api/project/#{p['id']}/media?limit=#{limit}&start=#{offset}")
    project_media['media'].each do|m|
      #get the media metadata to see what languages are published
      media_metadata = execute_api_request("https://dotsub.com/api/media/#{m['id']}")
      media_metadata['languages'].each do|l|
        if l[1]['percentageComplete'] == 100
          #download captions for published videos
          download_file("https://dotsub.com/media/#{m['id']}/c/#{l[0]}/srt")
        end
      end
    end

    total_results = project_media['results']
    offset = offset + limit
  end while offset < total_results
end

