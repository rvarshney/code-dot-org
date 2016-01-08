class AddPublishedColumnToLevels < ActiveRecord::Migration
  def change
    add_column :levels, :published, :boolean
  end
end
