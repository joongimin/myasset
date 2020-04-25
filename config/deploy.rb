lock '~> 3.13.0'

set :application, 'myasset'
set :repo_url, 'git@github.com:joongimin/myasset.git'
set :deploy_to, "~/#{fetch(:application)}"
set :linked_dirs, %w[myasset-client/node_modules]

namespace :client do
  task :setup do
    on roles(:app) do
      within "#{release_path}/myasset-client" do
        execute :npm, 'install'
      end
    end
  end

  task :deploy do
    on roles(:app) do
      within "#{release_path}/myasset-client" do
        execute :npm, 'run', 'build'
      end
    end
  end
  after 'deploy:published', 'client:deploy'
end
