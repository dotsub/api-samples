=begin

A example of the project, media and download API using Ruby. This script downloads all published captions in a project as SRT files.
Please update the values with your project and username before running.

Note: This requires the extended API.

=end
require 'net/http'
require 'json'

$project_id = 'your_dotsub_project_id'
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

def download_file(url, filename)
  res = execute_http_request(url)
  File.write(filename, res.body)
end

#paging parameters
limit = 20
offset = 0
total_results = 0

begin
  #fetch 20 videos at a time from the project API
  project_media = execute_api_request("https://dotsub.com/api/project/#{$project_id}/media?limit=#{limit}&start=#{offset}")
  project_media['media'].each do|m|
    #get the media metadata to see what languages are published
    media_metadata = execute_api_request("https://dotsub.com/api/media/#{m['id']}")
    media_metadata['languages'].each do|l|
      if l[1]['workflowStatus'] == 'PUBLISHED'
        #download captions for published videos
        download_file("https://dotsub.com/media/#{m['id']}/c/#{l[0]}/srt", "#{m['id']}_#{l[0]}.srt")
      end
    end
  end

  total_results = project_media['results']
  offset = offset + limit

  puts "Offset #{offset}"
  puts "total_results #{total_results}"
end while offset < total_results